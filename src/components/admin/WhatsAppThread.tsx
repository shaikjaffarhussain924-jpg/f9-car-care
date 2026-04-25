import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Check, CheckCheck, AlertCircle, Phone, MoreVertical, Smile, Paperclip, Maximize2, Minimize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isYesterday } from "date-fns";

interface WAMessage {
  id: string;
  phone: string;
  direction: "in" | "out";
  body: string | null;
  status: string | null;
  error_message: string | null;
  created_at: string;
}

interface Props {
  phone: string;
  leadId?: string;
  leadType?: "appointment" | "contact";
  contactName?: string;
}

function variants(phone: string): string[] {
  const digits = phone.replace(/\D/g, "");
  const last10 = digits.slice(-10);
  const set = new Set<string>();
  if (last10) {
    set.add(last10);
    set.add(`91${last10}`);
  }
  if (digits) set.add(digits);
  return Array.from(set);
}

function StatusIcon({ status }: { status: string | null }) {
  switch (status) {
    case "sent": return <Check className="w-3.5 h-3.5 text-muted-foreground" />;
    case "delivered": return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />;
    case "read": return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
    case "failed": return <AlertCircle className="w-3.5 h-3.5 text-destructive" />;
    default: return <Check className="w-3.5 h-3.5 text-muted-foreground/50" />;
  }
}

function dayLabel(d: Date) {
  if (isToday(d)) return "TODAY";
  if (isYesterday(d)) return "YESTERDAY";
  return format(d, "MMMM d, yyyy").toUpperCase();
}

// WhatsApp-style doodle SVG background
const doodleBg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><g fill='none' stroke='%23000' stroke-opacity='0.06' stroke-width='1.2'><circle cx='30' cy='30' r='10'/><path d='M70 20 q15 10 0 20 q-15 10 0 20'/><circle cx='150' cy='40' r='6'/><path d='M120 80 l8 -14 l8 14 z'/><circle cx='40' cy='110' r='14'/><path d='M170 130 q-10 15 -20 0 q-10 -15 -20 0'/><path d='M80 160 h30 v15 h-30 z'/><circle cx='160' cy='180' r='8'/><path d='M10 180 q15 -10 30 0'/></g></svg>")`;

export default function WhatsAppThread({ phone, leadId, leadType, contactName }: Props) {
  const [messages, setMessages] = useState<WAMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const phoneVariants = useMemo(() => variants(phone), [phone]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .in("phone", phoneVariants)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as WAMessage[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`wa-${phoneVariants.join("-")}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whatsapp_messages" },
        (payload: any) => {
          const row = (payload.new ?? payload.old) as WAMessage;
          if (!row || !phoneVariants.includes(row.phone)) return;
          fetchMessages();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-send", {
        body: { phone, body: body.trim(), leadId, leadType },
      });
      if (error) throw error;
      if ((data as any)?.error) {
        toast({ title: "WhatsApp error", description: (data as any).error, variant: "destructive" });
      } else {
        setBody("");
      }
    } catch (err: any) {
      toast({
        title: "Send failed",
        description: err?.message ?? "Could not send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  // Group messages by day
  const grouped: Array<{ day: string; items: WAMessage[] }> = [];
  messages.forEach((m) => {
    const day = format(new Date(m.created_at), "yyyy-MM-dd");
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) last.items.push(m);
    else grouped.push({ day, items: [m] });
  });

  const initial = (contactName || phone || "?").trim().charAt(0).toUpperCase();
  const displayName = contactName || `+${phone.replace(/\D/g, "")}`;

  return (
    <>
      {fullscreen && <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={() => setFullscreen(false)} />}
      <div className={cn(
        "flex flex-col bg-[#efeae2] dark:bg-[#0b141a]",
        fullscreen
          ? "fixed inset-0 sm:inset-4 md:inset-8 z-50 rounded-none sm:rounded-xl overflow-hidden shadow-2xl animate-scale-in"
          : "h-full"
      )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#008069] dark:bg-[#202c33] text-white shadow-sm shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-base ring-2 ring-white/30">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[15px] truncate leading-tight">{displayName}</div>
          <div className="text-[12px] text-white/75 truncate flex items-center gap-1.5">
            <span>+{phone.replace(/\D/g, "")}</span>
            <span className="inline-flex items-center gap-1">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              online
            </span>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Call">
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => setFullscreen((v) => !v)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="More">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
        style={{ backgroundImage: doodleBg, backgroundRepeat: "repeat" }}
      >
        {loading ? (
          <div className="flex justify-center pt-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center pt-12">
            <div className="bg-[#fff3c4] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-xs px-3 py-2 rounded-md shadow-sm max-w-xs text-center">
              No messages yet. Start the conversation 👋
            </div>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.day} className="space-y-1">
              <div className="flex justify-center my-3">
                <span className="bg-white/95 dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[11px] font-medium px-3 py-1 rounded-md shadow-sm">
                  {dayLabel(new Date(group.day))}
                </span>
              </div>
              {group.items.map((m, i) => {
                const out = m.direction === "out";
                const prev = group.items[i - 1];
                const grouped = prev && prev.direction === m.direction;
                return (
                  <div
                    key={m.id}
                    style={{ animationDelay: `${Math.min(i, 6) * 25}ms` }}
                    className={cn(
                      "flex animate-fade-in",
                      out ? "justify-end" : "justify-start",
                      grouped ? "mt-0.5" : "mt-2",
                    )}
                  >
                    <div
                      className={cn(
                        "relative max-w-[78%] sm:max-w-[65%] pl-2 pr-2 py-[6px] text-[14.2px] leading-[19px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] rounded-[7.5px]",
                        out
                          ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef]"
                          : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef]",
                        !grouped && (out ? "rounded-tr-none" : "rounded-tl-none"),
                      )}
                    >
                      {/* Tail */}
                      {!grouped && (
                        <svg
                          aria-hidden
                          viewBox="0 0 8 13"
                          className={cn(
                            "absolute top-0 w-2 h-[13px]",
                            out ? "-right-2 text-[#d9fdd3] dark:text-[#005c4b]" : "-left-2 scale-x-[-1] text-white dark:text-[#202c33]",
                          )}
                        >
                          <path
                            fill="currentColor"
                            d="M5.188 1.25c-.41-.625-1.07-1-1.766-1H0v13h7.082c1.484 0 2.328-1.703 1.43-2.883L5.188 1.25z"
                          />
                        </svg>
                      )}
                      <span className="whitespace-pre-wrap break-words align-bottom">{m.body}</span>
                      <span className="inline-block w-[60px]" aria-hidden />
                      <span className="absolute bottom-[3px] right-[7px] flex items-center gap-1 text-[11px] text-[#667781] dark:text-[#8696a0] select-none">
                        <span>{format(new Date(m.created_at), "HH:mm")}</span>
                        {out && <StatusIcon status={m.status} />}
                      </span>
                      {m.error_message && (
                        <div className="text-[11px] text-destructive mt-1">{m.error_message}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="px-3 py-2 bg-[#f0f2f5] dark:bg-[#202c33] shrink-0">
        <div className="flex gap-2 items-end">
          <button
            type="button"
            className="p-2 text-[#54656f] dark:text-[#aebac1] hover:text-foreground transition-colors"
            aria-label="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 text-[#54656f] dark:text-[#aebac1] hover:text-foreground transition-colors"
            aria-label="Attach"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type a message"
            rows={1}
            className="resize-none min-h-[42px] max-h-32 rounded-lg bg-white dark:bg-[#2a3942] border-0 shadow-sm focus-visible:ring-1 focus-visible:ring-primary/40 text-[14.5px] py-2.5"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button
            onClick={send}
            disabled={sending || !body.trim()}
            size="icon"
            className="rounded-full bg-[#008069] hover:bg-[#017561] text-white shrink-0 w-11 h-11 shadow-md transition-transform active:scale-95"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
