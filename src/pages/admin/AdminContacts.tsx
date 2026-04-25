import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle, Save } from "lucide-react";
import { format } from "date-fns";
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

const statusColor: Record<Status, string> = {
  new: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  in_progress: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
};

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} {filtered.length === 1 ? "message" : "messages"}
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search name / phone / email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 transition-all focus:w-72"
          />
          <Select value={filter} onValueChange={(v) => setFilter(v as Status | "all")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="max-w-md">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No contact messages found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r, i) => (
                <TableRow
                  key={r.id}
                  style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                  className="cursor-pointer animate-fade-in hover:bg-secondary/40 transition-colors"
                  onClick={() => setDrawerRow(r)}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(r.created_at), "dd MMM HH:mm")}
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.phone ?? "—"}</TableCell>
                  <TableCell>{r.email ?? "—"}</TableCell>
                  <TableCell className="max-w-md truncate">{r.message}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={r.status}
                      onValueChange={(v) => updateStatus(r.id, v as Status)}
                      disabled={savingId === r.id}
                    >
                      <SelectTrigger className="h-8 w-36">
                        <Badge variant="outline" className={statusColor[r.status]}>
                          {r.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!r.phone}
                      onClick={() => setDrawerRow(r)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!drawerRow} onOpenChange={(open) => !open && setDrawerRow(null)}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
          {drawerRow && (
            <>
              <SheetHeader className="p-6 pb-3 border-b">
                <SheetTitle>{drawerRow.name}</SheetTitle>
                <SheetDescription>
                  {drawerRow.phone ?? "no phone"} · {drawerRow.email ?? "no email"}
                </SheetDescription>
              </SheetHeader>

              <div className="px-6 py-3 border-b space-y-3">
                <div className="text-sm">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Message</div>
                  <div className="bg-secondary/40 rounded p-2 whitespace-pre-wrap">{drawerRow.message}</div>
                </div>
                <NotesEditor
                  initial={drawerRow.staff_notes ?? ""}
                  saving={savingId === drawerRow.id}
                  onSave={(n) => saveNotes(drawerRow.id, n)}
                />
              </div>

              <div className="flex-1 min-h-0">
                {drawerRow.phone ? (
                  <WhatsAppThread
                    phone={drawerRow.phone}
                    leadId={drawerRow.id}
                    leadType="contact"
                  />
                ) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No phone number on file — can't open WhatsApp thread.
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

function NotesEditor({
  initial, saving, onSave,
}: { initial: string; saving: boolean; onSave: (n: string) => void }) {
  const [val, setVal] = useState(initial);
  useEffect(() => setVal(initial), [initial]);
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">Staff notes</div>
      <Textarea value={val} onChange={(e) => setVal(e.target.value)} rows={2} />
      <Button size="sm" variant="outline" onClick={() => onSave(val)} disabled={saving}>
        {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
        Save notes
      </Button>
    </div>
  );
}
