import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { u as useToast, N as Navbar, B as Button, F as Footer } from "../main.mjs";
import { I as Input } from "./input-6XZgwDxx.js";
import { L as Label } from "./label-DPO1kvhT.js";
import { T as Textarea } from "./textarea-6Ttc-Vmm.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-Uj2s_YfI.js";
import { s as supabase } from "./client-CJtFN4ff.js";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "framer-motion";
import "embla-carousel-react";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@supabase/supabase-js";
function Contact() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: "Please fill name and message", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      message: form.message.trim()
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Message sent ✓", description: "We'll get back to you shortly." });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Contact F9 Car Care | Hyderabad" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Send F9 Car Care a message. We respond on WhatsApp, email, or phone." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://www.f9carcare.co.in/contact" })
    ] }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-28 pb-16 section-padding bg-background min-h-[80vh]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-6", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Back to Home"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "luxury-divider mb-6" }),
        /* @__PURE__ */ jsx("h1", { className: "font-heading text-3xl md:text-5xl font-bold mb-3 tracking-tight", children: "Get in touch" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tell us what your car needs. We'll reply soon." })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Send a message" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "We typically respond within a few hours." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: done ? /* @__PURE__ */ jsxs("div", { className: "text-center py-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Send, { className: "w-6 h-6 text-primary" }) }),
          /* @__PURE__ */ jsxs("p", { className: "font-medium mb-1", children: [
            "Thanks ",
            form.name.split(" ")[0],
            "!"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Our team will reach out shortly." })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name *" }),
              /* @__PURE__ */ jsx(Input, { id: "name", maxLength: 100, value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium select-none", children: "+91" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "phone",
                    type: "tel",
                    maxLength: 10,
                    className: "pl-12",
                    value: form.phone.replace(/^\+91/, ""),
                    onChange: (e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setForm({ ...form, phone: digits ? `+91${digits}` : "" });
                    }
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsx(Input, { id: "email", type: "email", maxLength: 255, value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "message", children: "Message *" }),
            /* @__PURE__ */ jsx(Textarea, { id: "message", rows: 5, maxLength: 1e3, value: form.message, onChange: (e) => setForm({ ...form, message: e.target.value }), required: true })
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: busy, children: [
            busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }),
            "Send message"
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Contact as default
};
