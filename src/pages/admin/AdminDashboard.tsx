import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2, Calendar, Users, Clock, CheckCircle2, XCircle, MessageSquare, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const bookingsChartConfig: ChartConfig = {
  count: { label: "Bookings", color: "hsl(217 91% 60%)" },
};

interface Upcoming {
  id: string;
  name: string;
  service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayBookings: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    newContacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [bookingsOverTime, setBookingsOverTime] = useState<{ date: string; count: number }[]>([]);
  const [upcoming, setUpcoming] = useState<Upcoming[]>([]);

  const loadData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);
    const sinceIso = since.toISOString();

    const now = new Date();
    const in24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const todayStr = format(now, "yyyy-MM-dd");
    const next24Str = format(in24, "yyyy-MM-dd");

    const [total, todayCount, pending, completed, cancelled, contacts, chartRows, upcomingRows] =
      await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }).gte("created_at", todayIso),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "cancelled"),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("appointments").select("created_at").gte("created_at", sinceIso),
        supabase
          .from("appointments")
          .select("id, name, service, preferred_date, preferred_time, status")
          .in("status", ["pending", "confirmed"])
          .gte("preferred_date", todayStr)
          .lte("preferred_date", next24Str)
          .order("preferred_date", { ascending: true })
          .order("preferred_time", { ascending: true })
          .limit(8),
      ]);

    setStats({
      totalAppointments: total.count ?? 0,
      todayBookings: todayCount.count ?? 0,
      pending: pending.count ?? 0,
      completed: completed.count ?? 0,
      cancelled: cancelled.count ?? 0,
      newContacts: contacts.count ?? 0,
    });
    setUpcoming((upcomingRows.data ?? []) as Upcoming[]);

    const counts: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      counts[d.toISOString().slice(0, 10)] = 0;
    }
    (chartRows.data ?? []).forEach((r: any) => {
      const k = r.created_at.slice(0, 10);
      if (k in counts) counts[k]++;
    });
    setBookingsOverTime(Object.entries(counts).map(([date, count]) => ({ date, count })));

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
    { label: "Total Appointments", value: stats.totalAppointments, icon: Calendar, tile: "bg-amber-100 text-amber-700" },
    { label: "Today's Bookings", value: stats.todayBookings, icon: Users, tile: "bg-emerald-100 text-emerald-700" },
    { label: "Pending", value: stats.pending, icon: Clock, tile: "bg-orange-100 text-orange-700" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, tile: "bg-green-100 text-green-700" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, tile: "bg-rose-100 text-rose-700" },
    { label: "New Contacts", value: stats.newContacts, icon: MessageSquare, tile: "bg-violet-100 text-violet-700" },
  ];

  const statusPill: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-6 animate-fade-in">
        Dashboard
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="bg-card border border-border rounded-2xl p-4 animate-fade-in hover:shadow-md transition-shadow"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", c.tile)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-bold tracking-tight tabular-nums">{c.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
                </div>
              );
            })}
          </div>

          {/* Chart + Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-border rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <TrendingUp className="w-4 h-4 text-foreground" />
                <CardTitle className="text-base font-semibold">Bookings — Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={bookingsChartConfig} className="h-[280px] w-full">
                  <AreaChart data={bookingsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: string) => {
                        const d = new Date(v + "T00:00:00");
                        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                      }}
                      interval={4}
                      fontSize={11}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      fontSize={11}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(v: string) => {
                            const d = new Date(v + "T00:00:00");
                            return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                          }}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="var(--color-count)"
                      fill="url(#fillBookings)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-border rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Calendar className="w-4 h-4 text-foreground" />
                <CardTitle className="text-base font-semibold">Upcoming (24h)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-6 text-center">No upcoming appointments.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {upcoming.map((r, i) => (
                      <li
                        key={r.id}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className="flex items-start gap-3 px-5 py-3 animate-fade-in"
                      >
                        <div className="w-9 h-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-foreground">
                          {r.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-semibold truncate">{r.name}</div>
                            <span className={cn(
                              "text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full whitespace-nowrap",
                              statusPill[r.status] ?? "bg-muted",
                            )}>
                              {r.status}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{r.service ?? "—"}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {r.preferred_date
                              ? format(new Date(r.preferred_date), "d MMM")
                              : "—"}
                            {r.preferred_time ? ` · ${r.preferred_time}` : ""}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
