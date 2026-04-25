import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, MessageSquare, Clock, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    newContacts: 0,
    todayBookings: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<any[]>([]);

  const loadData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const [pending, contacts, todayCount, total, recentRows] = await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).gte("created_at", todayIso),
      supabase.from("appointments").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id, name, phone, service, status, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    setStats({
      pendingAppointments: pending.count ?? 0,
      newContacts: contacts.count ?? 0,
      todayBookings: todayCount.count ?? 0,
      totalAppointments: total.count ?? 0,
    });
    setRecent(recentRows.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel("dashboard-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const cards = [
    {
      label: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Calendar,
      tint: "from-amber-500/20 to-amber-500/5",
      ring: "ring-amber-500/30",
      iconColor: "text-amber-500",
    },
    {
      label: "New Messages",
      value: stats.newContacts,
      icon: MessageSquare,
      tint: "from-sky-500/20 to-sky-500/5",
      ring: "ring-sky-500/30",
      iconColor: "text-sky-500",
    },
    {
      label: "Today's Bookings",
      value: stats.todayBookings,
      icon: Clock,
      tint: "from-emerald-500/20 to-emerald-500/5",
      ring: "ring-emerald-500/30",
      iconColor: "text-emerald-500",
    },
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      icon: TrendingUp,
      tint: "from-primary/20 to-primary/5",
      ring: "ring-primary/30",
      iconColor: "text-primary",
    },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    confirmed: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    cancelled: "bg-destructive/15 text-destructive",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center gap-3"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="absolute inset-0 rounded-xl ring-2 ring-primary/40 animate-pulse-ring pointer-events-none" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of bookings & messages</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <Card className={cn(
                    "relative overflow-hidden border-border/60 ring-1",
                    c.ring,
                  )}>
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", c.tint)} />
                    <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                        {c.label}
                      </CardTitle>
                      <Icon className={cn("w-4 h-4", c.iconColor)} />
                    </CardHeader>
                    <CardContent className="relative">
                      <motion.div
                        key={c.value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 200 }}
                        className="text-4xl font-bold tracking-tight"
                      >
                        {c.value}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recent.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-6 text-center">No bookings yet.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recent.map((r, i) => (
                      <motion.li
                        key={r.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/40 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {r.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{r.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {r.phone} · {r.service ?? "—"}
                          </div>
                        </div>
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full",
                          statusColor[r.status] ?? "bg-muted",
                        )}>
                          {r.status}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
