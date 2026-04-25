import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Check, CheckCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
}

// Build phone variants: bare 10-digit and 91-prefixed
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
    case "sent": return <Check className="w-3 h-3 opacity-60" />;
    case "delivered": return <CheckCheck className="w-3 h-3 opacity-60" />;
    case "read": return <CheckCheck className="w-3 h-3 text-sky-400" />;
    case "failed": return <AlertCircle className="w-3 h-3 text-destructive" />;
    default: return null;
  }
}

export default function WhatsAppThread({ phone, leadId, leadType }: Props) {
  const [messages, setMessages] = useState<WAMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const phoneVariants = variants(phone);

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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
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

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/30">
        {loading ? (
          <div className="flex justify-center pt-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground pt-8">
            No messages yet. Say hello 👋
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={m.id}
              style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
              className={cn(
                "flex animate-scale-in",
                m.direction === "out" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm transition-transform hover:scale-[1.01]",
                  m.direction === "out"
                    ? "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-sm shadow-primary/20"
                    : "bg-card border border-border rounded-bl-sm",
                )}
              >
                <div className="whitespace-pre-wrap break-words">{m.body}</div>
                <div className={cn(
                  "flex items-center gap-1 justify-end mt-1 text-[10px]",
                  m.direction === "out" ? "text-primary-foreground/70" : "text-muted-foreground",
                )}>
                  <span>{format(new Date(m.created_at), "HH:mm")}</span>
                  {m.direction === "out" && <StatusIcon status={m.status} />}
                </div>
                {m.error_message && (
                  <div className="text-[10px] text-destructive mt-1">{m.error_message}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-border p-3 bg-background">
        <div className="flex gap-2 items-end">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type a message…"
            rows={2}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button onClick={send} disabled={sending || !body.trim()} size="icon">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          To: +{phone.replace(/\D/g, "")} · Press Enter to send
        </div>
      </div>
    </div>
  );
}
