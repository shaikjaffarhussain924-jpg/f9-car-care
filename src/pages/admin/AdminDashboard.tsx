import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, MessageSquare, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    newContacts: 0,
    todayBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString();

      const [pending, contacts, todayCount] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("appointments").select("id", { count: "exact", head: true }).gte("created_at", todayIso),
      ]);

      setStats({
        pendingAppointments: pending.count ?? 0,
        newContacts: contacts.count ?? 0,
        todayBookings: todayCount.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Pending Appointments", value: stats.pendingAppointments, icon: Calendar },
    { label: "New Contact Messages", value: stats.newContacts, icon: MessageSquare },
    { label: "Today's Bookings", value: stats.todayBookings, icon: Clock },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{c.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
