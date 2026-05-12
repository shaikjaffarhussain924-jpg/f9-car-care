import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useToast, s as supabase, I as Input, e as cn, T as Textarea, B as Button } from "../main.mjs";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle, W as WhatsAppThread } from "./WhatsAppThread-CHH7lNwC.js";
import { Search, Loader2, MessageCircle, Phone, Mail, Save } from "lucide-react";
import { format } from "date-fns";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "react-helmet-async";
import "framer-motion";
import "embla-carousel-react";
import "@radix-ui/react-slot";
import "react-day-picker";
import "@radix-ui/react-popover";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@supabase/supabase-js";
import "@radix-ui/react-accordion";
import "@radix-ui/react-dialog";
const statusPillColor = {
  new: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800"
};
const FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" }
];
function AdminContacts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [drawerRow, setDrawerRow] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const { toast } = useToast();
  const load = async () => {
    setLoading(true);
    let q = supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, [filter]);
  useEffect(() => {
    const channel = supabase.channel("contacts-live").on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, () => load()).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);
  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.name.toLowerCase().includes(s) || (r.phone ?? "").includes(s) || (r.email ?? "").toLowerCase().includes(s) || r.message.toLowerCase().includes(s);
  });
  const updateStatus = async (id, status) => {
    setSavingId(id);
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else {
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      if ((drawerRow == null ? void 0 : drawerRow.id) === id) setDrawerRow({ ...drawerRow, status });
      toast({ title: `Marked ${status.replace("_", " ")}` });
    }
    setSavingId(null);
  };
  const saveNotes = async (id, notes) => {
    setSavingId(id);
    const { error } = await supabase.from("contact_submissions").update({ staff_notes: notes }).eq("id", id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Notes saved" });
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, staff_notes: notes } : r));
    }
    setSavingId(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-heading text-3xl md:text-4xl font-bold tracking-tight mb-6 animate-fade-in", children: "Contact Submissions" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search by name, phone or email...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9 h-11 rounded-full bg-card border-border"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: FILTERS.map((f) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setFilter(f.value),
          className: cn(
            "px-4 h-11 rounded-full text-sm font-medium transition-all border",
            filter === f.value ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border hover:bg-secondary/50"
          ),
          children: f.label
        },
        f.value
      )) })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-muted-foreground" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center text-muted-foreground py-16 bg-card rounded-2xl border border-border flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsx(MessageCircle, { className: "w-10 h-10 opacity-40" }),
      "No contacts found"
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: filtered.map((r, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setDrawerRow(r),
        style: { animationDelay: `${Math.min(i, 10) * 30}ms` },
        className: "w-full text-left bg-card border border-border rounded-2xl px-5 py-4 hover:shadow-md hover:border-foreground/20 transition-all animate-fade-in",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { className: "font-heading font-semibold text-base", children: r.name }),
              /* @__PURE__ */ jsx("span", { className: cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", statusPillColor[r.status]), children: r.status.replace("_", " ") })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: format(new Date(r.created_at), "M/d/yyyy") })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/80 mb-2 line-clamp-2", children: r.message }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap", children: [
            r.phone && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5" }),
              " ",
              r.phone
            ] }),
            r.email && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5" }),
              " ",
              r.email
            ] })
          ] })
        ]
      },
      r.id
    )) }),
    /* @__PURE__ */ jsx(Sheet, { open: !!drawerRow, onOpenChange: (open) => !open && setDrawerRow(null), children: /* @__PURE__ */ jsx(SheetContent, { className: "w-full sm:max-w-[520px] flex flex-col p-0 gap-0", children: drawerRow && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(SheetHeader, { className: "p-6 pb-4 flex-row items-center justify-between space-y-0", children: /* @__PURE__ */ jsx(SheetTitle, { className: "text-xl font-heading", children: "Contact Details" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-6 pb-6 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Name" }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: drawerRow.name }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1", children: format(new Date(drawerRow.created_at), "dd MMM yyyy 'at' HH:mm") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(Field, { label: "Phone", value: drawerRow.phone ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-primary", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5" }),
            " ",
            drawerRow.phone
          ] }) : "—" }),
          /* @__PURE__ */ jsx(Field, { label: "Email", value: drawerRow.email ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "Status" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: ["new", "in_progress", "resolved"].map((s) => /* @__PURE__ */ jsx(
            "button",
            {
              disabled: savingId === drawerRow.id,
              onClick: () => updateStatus(drawerRow.id, s),
              className: cn(
                "px-4 h-9 rounded-full text-sm font-medium border transition-all capitalize",
                drawerRow.status === s ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border hover:bg-secondary/50"
              ),
              children: s.replace("_", " ")
            },
            s
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1.5", children: "Message" }),
          /* @__PURE__ */ jsx("div", { className: "bg-secondary/40 rounded-md p-3 whitespace-pre-wrap", children: drawerRow.message })
        ] }),
        /* @__PURE__ */ jsx(
          NotesEditor,
          {
            initial: drawerRow.staff_notes ?? "",
            saving: savingId === drawerRow.id,
            onSave: (notes) => saveNotes(drawerRow.id, notes)
          }
        ),
        drawerRow.phone && /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-2", children: [
            /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4" }),
            "WhatsApp Conversation"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl overflow-hidden border border-border h-[420px] flex flex-col", children: /* @__PURE__ */ jsx(
            WhatsAppThread,
            {
              phone: drawerRow.phone,
              leadId: drawerRow.id,
              leadType: "contact",
              contactName: drawerRow.name
            }
          ) })
        ] })
      ] })
    ] }) }) })
  ] });
}
function Field({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: label }),
    /* @__PURE__ */ jsx("div", { className: "text-sm font-medium break-all", children: value })
  ] });
}
function NotesEditor({
  initial,
  saving,
  onSave
}) {
  const [val, setVal] = useState(initial);
  useEffect(() => setVal(initial), [initial]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Staff Notes" }),
    /* @__PURE__ */ jsx(
      Textarea,
      {
        value: val,
        onChange: (e) => setVal(e.target.value),
        rows: 3,
        placeholder: "Internal notes...",
        className: "resize-none"
      }
    ),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "sm",
        onClick: () => onSave(val),
        disabled: saving,
        className: "bg-foreground text-background hover:bg-foreground/90",
        children: [
          saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin mr-1" }) : /* @__PURE__ */ jsx(Save, { className: "w-3 h-3 mr-1" }),
          "Save Notes"
        ]
      }
    )
  ] });
}
export {
  AdminContacts as default
};
