import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X, Phone, Minimize2, Maximize2, MoreVertical, Loader2, Smile, Paperclip, Send, Check, AlertCircle, CheckCheck } from "lucide-react";
import * as React from "react";
import { useState, useRef, useMemo, useEffect } from "react";
import { c as cn, u as useToast, B as Button } from "../main.mjs";
import { s as supabase } from "./client-CJtFN4ff.js";
import { T as Textarea } from "./textarea-6Ttc-Vmm.js";
import { format, isToday, isYesterday } from "date-fns";
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(
  ({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(SheetPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
      children,
      /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
        /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
      ] })
    ] })
  ] })
);
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, { ref, className: cn("text-lg font-semibold text-foreground", className), ...props }));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
function variants(phone) {
  const digits = phone.replace(/\D/g, "");
  const last10 = digits.slice(-10);
  const set = /* @__PURE__ */ new Set();
  if (last10) {
    set.add(last10);
    set.add(`91${last10}`);
  }
  if (digits) set.add(digits);
  return Array.from(set);
}
function StatusIcon({ status }) {
  switch (status) {
    case "sending":
      return /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 text-muted-foreground/70 animate-spin" });
    case "sent":
      return /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-muted-foreground" });
    case "delivered":
      return /* @__PURE__ */ jsx(CheckCheck, { className: "w-3.5 h-3.5 text-muted-foreground" });
    case "read":
      return /* @__PURE__ */ jsx(CheckCheck, { className: "w-3.5 h-3.5 text-[#53bdeb]" });
    case "failed":
      return /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 text-destructive" });
    default:
      return /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-muted-foreground/50" });
  }
}
function dayLabel(d) {
  if (isToday(d)) return "TODAY";
  if (isYesterday(d)) return "YESTERDAY";
  return format(d, "MMMM d, yyyy").toUpperCase();
}
const doodleBg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><g fill='none' stroke='%23000' stroke-opacity='0.06' stroke-width='1.2'><circle cx='30' cy='30' r='10'/><path d='M70 20 q15 10 0 20 q-15 10 0 20'/><circle cx='150' cy='40' r='6'/><path d='M120 80 l8 -14 l8 14 z'/><circle cx='40' cy='110' r='14'/><path d='M170 130 q-10 15 -20 0 q-10 -15 -20 0'/><path d='M80 160 h30 v15 h-30 z'/><circle cx='160' cy='180' r='8'/><path d='M10 180 q15 -10 30 0'/></g></svg>")`;
function WhatsAppThread({ phone, leadId, leadType, contactName }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const scrollRef = useRef(null);
  const { toast } = useToast();
  const phoneVariants = useMemo(() => variants(phone), [phone]);
  const phoneMatches = (p) => {
    if (!p) return false;
    const last10 = p.replace(/\D/g, "").slice(-10);
    return phoneVariants.some((v) => v.endsWith(last10) || last10.endsWith(v.slice(-10)));
  };
  const mergeRow = (row) => {
    setMessages((prev) => {
      const tempIdx = prev.findIndex(
        (m) => m.id.startsWith("temp-") && m.direction === row.direction && m.body === row.body
      );
      if (tempIdx !== -1) {
        const next = [...prev];
        next[tempIdx] = row;
        return next;
      }
      const idx = prev.findIndex((m) => m.id === row.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = row;
        return next;
      }
      return [...prev, row].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  };
  const fetchMessages = async () => {
    const { data } = await supabase.from("whatsapp_messages").select("*").in("phone", phoneVariants).order("created_at", { ascending: true });
    const rows = data ?? [];
    setMessages((prev) => {
      const temps = prev.filter(
        (m) => m.id.startsWith("temp-") && !rows.some((r) => r.direction === m.direction && r.body === m.body)
      );
      return [...rows, ...temps].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
    setLoading(false);
  };
  const notifyIncoming = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(1e-4, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + 0.35);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.4);
    } catch {
    }
    const original = document.title;
    let n = 0;
    const id = window.setInterval(() => {
      document.title = n++ % 2 === 0 ? "💬 New message…" : original;
    }, 900);
    const stop = () => {
      window.clearInterval(id);
      document.title = original;
      window.removeEventListener("focus", stop);
      document.removeEventListener("visibilitychange", stop);
    };
    window.addEventListener("focus", stop);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) stop();
    });
    window.setTimeout(stop, 8e3);
  };
  useEffect(() => {
    fetchMessages();
    const channel = supabase.channel(`wa-${phoneVariants.join("-")}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "whatsapp_messages" },
      (payload) => {
        const row = payload.new ?? payload.old;
        if (!row || !phoneMatches(row.phone)) return;
        if (payload.eventType === "DELETE") {
          setMessages((prev) => prev.filter((m) => m.id !== row.id));
        } else {
          const isNewIncoming = payload.eventType === "INSERT" && row.direction === "in";
          mergeRow(row);
          if (isNewIncoming) notifyIncoming();
        }
      }
    ).subscribe();
    const poll = setInterval(fetchMessages, 15e3);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [phone]);
  useEffect(() => {
    var _a;
    (_a = scrollRef.current) == null ? void 0 : _a.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  const send = async () => {
    const text = body.trim();
    if (!text) return;
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic = {
      id: tempId,
      phone,
      direction: "out",
      body: text,
      status: "sending",
      error_message: null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setMessages((prev) => [...prev, optimistic]);
    setBody("");
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-send", {
        body: { phone, body: text, leadId, leadType }
      });
      if (error) throw error;
      if (data == null ? void 0 : data.error) {
        const errMsg = data.error;
        setMessages(
          (prev) => prev.map(
            (m) => m.id === tempId ? { ...m, status: "failed", error_message: errMsg } : m
          )
        );
        toast({ title: "WhatsApp error", description: errMsg, variant: "destructive" });
      }
    } catch (err) {
      const errMsg = (err == null ? void 0 : err.message) ?? "Could not send message";
      setMessages(
        (prev) => prev.map(
          (m) => m.id === tempId ? { ...m, status: "failed", error_message: errMsg } : m
        )
      );
      toast({ title: "Send failed", description: errMsg, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };
  const grouped = [];
  messages.forEach((m) => {
    const day = format(new Date(m.created_at), "yyyy-MM-dd");
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) last.items.push(m);
    else grouped.push({ day, items: [m] });
  });
  const initial = (contactName || phone || "?").trim().charAt(0).toUpperCase();
  const displayName = contactName || `+${phone.replace(/\D/g, "")}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    fullscreen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 z-50 animate-fade-in", onClick: () => setFullscreen(false) }),
    /* @__PURE__ */ jsxs("div", { className: cn(
      "flex flex-col bg-[#efeae2] dark:bg-[#0b141a]",
      fullscreen ? "fixed inset-0 sm:inset-4 md:inset-8 z-50 rounded-none sm:rounded-xl overflow-hidden shadow-2xl animate-scale-in" : "h-full"
    ), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5 bg-[#008069] dark:bg-[#202c33] text-white shadow-sm shrink-0", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-base ring-2 ring-white/30", children: initial }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-[15px] truncate leading-tight", children: displayName }),
          /* @__PURE__ */ jsxs("div", { className: "text-[12px] text-white/75 truncate flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "+",
              phone.replace(/\D/g, "")
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "relative flex w-1.5 h-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" }),
                /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" })
              ] }),
              "online"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "p-2 rounded-full hover:bg-white/10 transition-colors", "aria-label": "Call", children: /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setFullscreen((v) => !v),
            className: "p-2 rounded-full hover:bg-white/10 transition-colors",
            "aria-label": fullscreen ? "Exit fullscreen" : "Fullscreen",
            children: fullscreen ? /* @__PURE__ */ jsx(Minimize2, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Maximize2, { className: "w-5 h-5" })
          }
        ),
        fullscreen && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setFullscreen(false),
            className: "p-2 rounded-full hover:bg-white/10 transition-colors",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "p-2 rounded-full hover:bg-white/10 transition-colors", "aria-label": "More", children: /* @__PURE__ */ jsx(MoreVertical, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: scrollRef,
          className: "flex-1 overflow-y-auto px-3 py-4 space-y-1",
          style: { backgroundImage: doodleBg, backgroundRepeat: "repeat" },
          children: loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-8", children: /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-muted-foreground" }) }) : messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-12", children: /* @__PURE__ */ jsx("div", { className: "bg-[#fff3c4] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-xs px-3 py-2 rounded-md shadow-sm max-w-xs text-center", children: "No messages yet. Start the conversation 👋" }) }) : grouped.map((group) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center my-3", children: /* @__PURE__ */ jsx("span", { className: "bg-white/95 dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[11px] font-medium px-3 py-1 rounded-md shadow-sm", children: dayLabel(new Date(group.day)) }) }),
            group.items.map((m, i) => {
              const out = m.direction === "out";
              const prev = group.items[i - 1];
              const grouped2 = prev && prev.direction === m.direction;
              return /* @__PURE__ */ jsx(
                "div",
                {
                  style: { animationDelay: `${Math.min(i, 6) * 25}ms` },
                  className: cn(
                    "flex animate-fade-in",
                    out ? "justify-end" : "justify-start",
                    grouped2 ? "mt-0.5" : "mt-2"
                  ),
                  children: /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: cn(
                        "relative max-w-[78%] sm:max-w-[65%] pl-2 pr-2 py-[6px] text-[14.2px] leading-[19px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] rounded-[7.5px]",
                        out ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef]" : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef]",
                        !grouped2 && (out ? "rounded-tr-none" : "rounded-tl-none")
                      ),
                      children: [
                        !grouped2 && /* @__PURE__ */ jsx(
                          "svg",
                          {
                            "aria-hidden": true,
                            viewBox: "0 0 8 13",
                            className: cn(
                              "absolute top-0 w-2 h-[13px]",
                              out ? "-right-2 text-[#d9fdd3] dark:text-[#005c4b]" : "-left-2 scale-x-[-1] text-white dark:text-[#202c33]"
                            ),
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                fill: "currentColor",
                                d: "M5.188 1.25c-.41-.625-1.07-1-1.766-1H0v13h7.082c1.484 0 2.328-1.703 1.43-2.883L5.188 1.25z"
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "whitespace-pre-wrap break-words align-bottom", children: m.body }),
                        /* @__PURE__ */ jsx("span", { className: "inline-block w-[60px]", "aria-hidden": true }),
                        /* @__PURE__ */ jsxs("span", { className: "absolute bottom-[3px] right-[7px] flex items-center gap-1 text-[11px] text-[#667781] dark:text-[#8696a0] select-none", children: [
                          /* @__PURE__ */ jsx("span", { children: format(new Date(m.created_at), "HH:mm") }),
                          out && /* @__PURE__ */ jsx(StatusIcon, { status: m.status })
                        ] }),
                        m.error_message && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-destructive mt-1", children: m.error_message })
                      ]
                    }
                  )
                },
                m.id
              );
            })
          ] }, group.day))
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-[#f0f2f5] dark:bg-[#202c33] shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-end", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "p-2 text-[#54656f] dark:text-[#aebac1] hover:text-foreground transition-colors",
            "aria-label": "Emoji",
            children: /* @__PURE__ */ jsx(Smile, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "p-2 text-[#54656f] dark:text-[#aebac1] hover:text-foreground transition-colors",
            "aria-label": "Attach",
            children: /* @__PURE__ */ jsx(Paperclip, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            value: body,
            onChange: (e) => setBody(e.target.value),
            placeholder: "Type a message",
            rows: 1,
            className: "resize-none min-h-[42px] max-h-32 rounded-lg bg-white dark:bg-[#2a3942] border-0 shadow-sm focus-visible:ring-1 focus-visible:ring-primary/40 text-[14.5px] py-2.5 text-[#111b21] dark:text-[#e9edef] placeholder:text-[#8696a0] caret-[#008069]",
            onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: send,
            disabled: sending || !body.trim(),
            size: "icon",
            className: "rounded-full bg-[#008069] hover:bg-[#017561] text-white shrink-0 w-11 h-11 shadow-md transition-transform active:scale-95",
            children: sending ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-5 h-5" })
          }
        )
      ] }) })
    ] })
  ] });
}
export {
  Sheet as S,
  WhatsAppThread as W,
  SheetContent as a,
  SheetHeader as b,
  SheetTitle as c
};
