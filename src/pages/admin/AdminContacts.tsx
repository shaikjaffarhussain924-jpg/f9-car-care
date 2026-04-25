import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Search, Phone, Mail, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import WhatsAppThread from "@/components/admin/WhatsAppThread";

type Status = "new" | "in_progress" | "resolved";

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: Status;
  staff_notes: string | null;
  created_at: string;
}

const statusPillColor: Record<Status, string> = {
  new: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
};

const FILTERS: Array<{ value: Status | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export default function AdminContacts() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");
  const [drawerRow, setDrawerRow] = useState<Contact | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    let q = supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setRows((data ?? []) as Contact[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  useEffect(() => {
    const channel = supabase
      .channel("contacts-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(s) ||
      (r.phone ?? "").includes(s) ||
      (r.email ?? "").toLowerCase().includes(s) ||
      r.message.toLowerCase().includes(s)
    );
  });

  const updateStatus = async (id: string, status: Status) => {
    setSavingId(id);
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      if (drawerRow?.id === id) setDrawerRow({ ...drawerRow, status });
      toast({ title: `Marked ${status.replace("_", " ")}` });
    }
    setSavingId(null);
  };

  const saveNotes = async (id: string, notes: string) => {
    setSavingId(id);
    const { error } = await supabase.from("contact_submissions").update({ staff_notes: notes }).eq("id", id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Notes saved" });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, staff_notes: notes } : r)));
    }
    setSavingId(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-6 animate-fade-in">
        Contact Submissions
      </h1>

      {/* Search + filter pills */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 rounded-full bg-card border-border"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 h-11 rounded-full text-sm font-medium transition-all border",
                filter === f.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground border-border hover:bg-secondary/50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards list */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 bg-card rounded-2xl border border-border flex flex-col items-center gap-3">
          <MessageCircle className="w-10 h-10 opacity-40" />
          No contacts found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setDrawerRow(r)}
              style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
              className="w-full text-left bg-card border border-border rounded-2xl px-5 py-4 hover:shadow-md hover:border-foreground/20 transition-all animate-fade-in"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-heading font-semibold text-base">{r.name}</span>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", statusPillColor[r.status])}>
                    {r.status.replace("_", " ")}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(r.created_at), "M/d/yyyy")}
                </span>
              </div>
              <div className="text-sm text-foreground/80 mb-2 line-clamp-2">{r.message}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                {r.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {r.phone}
                  </span>
                )}
                {r.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {r.email}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Drawer */}
      <Sheet open={!!drawerRow} onOpenChange={(open) => !open && setDrawerRow(null)}>
        <SheetContent className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0">
          {drawerRow && (
            <>
              <SheetHeader className="p-6 pb-4 flex-row items-center justify-between space-y-0">
                <SheetTitle className="text-xl font-heading">Contact Details</SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Name</div>
                  <div className="text-lg font-semibold">{drawerRow.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(drawerRow.created_at), "dd MMM yyyy 'at' HH:mm")}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Phone" value={
                    drawerRow.phone ? (
                      <span className="flex items-center gap-1.5 text-primary">
                        <Phone className="w-3.5 h-3.5" /> {drawerRow.phone}
                      </span>
                    ) : "—"
                  } />
                  <Field label="Email" value={drawerRow.email ?? "—"} />
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2">Status</div>
                  <div className="flex gap-2 flex-wrap">
                    {(["new", "in_progress", "resolved"] as Status[]).map((s) => (
                      <button
                        key={s}
                        disabled={savingId === drawerRow.id}
                        onClick={() => updateStatus(drawerRow.id, s)}
                        className={cn(
                          "px-4 h-9 rounded-full text-sm font-medium border transition-all capitalize",
                          drawerRow.status === s
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card text-foreground border-border hover:bg-secondary/50"
                        )}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-sm">
                  <div className="text-xs text-muted-foreground mb-1.5">Message</div>
                  <div className="bg-secondary/40 rounded-md p-3 whitespace-pre-wrap">{drawerRow.message}</div>
                </div>

                <NotesEditor
                  initial={drawerRow.staff_notes ?? ""}
                  saving={savingId === drawerRow.id}
                  onSave={(notes) => saveNotes(drawerRow.id, notes)}
                />

                {/* WhatsApp section */}
                {drawerRow.phone && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Conversation
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-border h-[420px] flex flex-col">
                      <WhatsAppThread
                        phone={drawerRow.phone}
                        leadId={drawerRow.id}
                        leadType="contact"
                        contactName={drawerRow.name}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-medium break-all">{value}</div>
    </div>
  );
}

function NotesEditor({
  initial, saving, onSave,
}: { initial: string; saving: boolean; onSave: (n: string) => void }) {
  const [val, setVal] = useState(initial);
  useEffect(() => setVal(initial), [initial]);
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Staff Notes</div>
      <Textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={3}
        placeholder="Internal notes..."
        className="resize-none"
      />
      <Button
        size="sm"
        onClick={() => onSave(val)}
        disabled={saving}
        className="bg-foreground text-background hover:bg-foreground/90"
      >
        {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
        Save Notes
      </Button>
    </div>
  );
}
