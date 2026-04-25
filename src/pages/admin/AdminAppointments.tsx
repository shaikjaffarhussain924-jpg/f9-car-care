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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle, Save, Phone, Mail, Calendar as CalIcon, Clock, Stethoscope, User } from "lucide-react";
import { format } from "date-fns";
import WhatsAppThread from "@/components/admin/WhatsAppThread";

type Status = "pending" | "confirmed" | "completed" | "cancelled";

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  doctor: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  source: string | null;
  status: Status;
  staff_notes: string | null;
  created_at: string;
}

const statusColor: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  confirmed: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function AdminAppointments() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");
  const [drawerRow, setDrawerRow] = useState<Appointment | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    let q = supabase.from("appointments").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setRows((data ?? []) as Appointment[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  useEffect(() => {
    const channel = supabase
      .channel("appointments-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(s) ||
      r.phone.includes(s) ||
      (r.email ?? "").toLowerCase().includes(s) ||
      (r.service ?? "").toLowerCase().includes(s)
    );
  });

  const updateStatus = async (id: string, status: Status) => {
    setSavingId(id);
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      if (drawerRow?.id === id) setDrawerRow({ ...drawerRow, status });
    }
    setSavingId(null);
  };

  const saveNotes = async (id: string, notes: string) => {
    setSavingId(id);
    const { error } = await supabase.from("appointments").update({ staff_notes: notes }).eq("id", id);
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
          <h1 className="font-heading text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} {filtered.length === 1 ? "booking" : "bookings"}
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <TableHead>Service</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No appointments found
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
                  <TableCell>{r.phone}</TableCell>
                  <TableCell>{r.service ?? "—"}</TableCell>
                  <TableCell className="text-xs">
                    {r.preferred_date ?? "—"} {r.preferred_time ?? ""}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={r.status}
                      onValueChange={(v) => updateStatus(r.id, v as Status)}
                      disabled={savingId === r.id}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <Badge variant="outline" className={statusColor[r.status]}>
                          {r.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => setDrawerRow(r)}>
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
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="text-xl">{drawerRow.name}</SheetTitle>
                <SheetDescription>
                  Created {format(new Date(drawerRow.created_at), "dd MMM yyyy 'at' HH:mm")}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
                <div className="px-6 pt-3 border-b">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="whatsapp">
                      <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="details" className="flex-1 overflow-y-auto p-6 space-y-5 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <Field icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={drawerRow.phone} />
                    <Field icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={drawerRow.email ?? "—"} />
                    <Field icon={<Stethoscope className="w-3.5 h-3.5" />} label="Service" value={drawerRow.service ?? "—"} />
                    <Field icon={<User className="w-3.5 h-3.5" />} label="Doctor" value={drawerRow.doctor ?? "—"} />
                    <Field icon={<CalIcon className="w-3.5 h-3.5" />} label="Date" value={drawerRow.preferred_date ?? "—"} />
                    <Field icon={<Clock className="w-3.5 h-3.5" />} label="Time" value={drawerRow.preferred_time ?? "—"} />
                  </div>

                  {drawerRow.message && (
                    <div className="text-sm">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">Customer message</div>
                      <div className="bg-secondary/40 rounded-md p-3 whitespace-pre-wrap">{drawerRow.message}</div>
                    </div>
                  )}

                  <NotesEditor
                    initial={drawerRow.staff_notes ?? ""}
                    saving={savingId === drawerRow.id}
                    onSave={(notes) => saveNotes(drawerRow.id, notes)}
                  />
                </TabsContent>

                <TabsContent value="whatsapp" className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <WhatsAppThread
                    phone={drawerRow.phone}
                    leadId={drawerRow.id}
                    leadType="appointment"
                    contactName={drawerRow.name}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1">
        {icon} {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
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
