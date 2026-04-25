import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Calendar, MessageSquare, LogOut, BellRing, Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) {
        setAuthorized(false);
        setChecking(false);
        navigate("/admin/login", { replace: true });
      }
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setChecking(false);
        navigate("/admin/login", { replace: true });
        return;
      }
      setEmail(session.user.email ?? null);

      const { data, error } = await supabase.rpc("is_admin_or_staff", {
        _user_id: session.user.id,
      });

      if (!mounted) return;
      if (error || !data) {
        await supabase.auth.signOut();
        setChecking(false);
        navigate("/admin/login?denied=1", { replace: true });
        return;
      }
      setAuthorized(true);
      setChecking(false);
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Sound mute toggle (persisted)
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("admin-sound-muted") === "1";
  });
  useEffect(() => {
    localStorage.setItem("admin-sound-muted", muted ? "1" : "0");
  }, [muted]);

  // Global realtime listener — toast + chime when new bookings / contacts arrive
  useEffect(() => {
    if (!authorized) return;

    const playChime = () => {
      if (localStorage.getItem("admin-sound-muted") === "1") return;
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = "sine"; o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        o.start(); o.stop(ctx.currentTime + 0.45);
      } catch { /* ignore */ }
    };

    const channel = supabase
      .channel("admin-global-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        (payload: any) => {
          const row = payload.new;
          playChime();
          toast.success("New booking received!", {
            description: `${row.name} · ${row.service ?? "service"}${row.preferred_date ? ` · ${row.preferred_date}` : ""}`,
            icon: <BellRing className="w-4 h-4" />,
            action: { label: "View", onClick: () => navigate("/admin/appointments") },
            duration: 8000,
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        (payload: any) => {
          const row = payload.new;
          playChime();
          toast("New contact message", {
            description: `${row.name} — ${(row.message ?? "").slice(0, 60)}…`,
            icon: <MessageSquare className="w-4 h-4" />,
            action: { label: "Open", onClick: () => navigate("/admin/contacts") },
            duration: 8000,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authorized, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!authorized) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/appointments", label: "Appointments", icon: Calendar },
    { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-gradient-to-b from-card to-card/60 backdrop-blur flex flex-col animate-fade-in">
        <div className="px-5 py-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-heading font-bold text-primary-foreground shadow-lg shadow-primary/20">
            F9
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-sm font-bold tracking-tight">CRM Console</div>
            <div className="text-[11px] text-muted-foreground truncate">{email}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !muted;
              setMuted(next);
              toast(next ? "Notifications muted" : "Notifications unmuted", {
                icon: next ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />,
                duration: 2000,
              });
            }}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              muted
                ? "text-muted-foreground hover:bg-secondary"
                : "text-primary hover:bg-primary/10",
            )}
            aria-label={muted ? "Unmute notifications" : "Mute notifications"}
            title={muted ? "Unmute notifications" : "Mute notifications"}
          >
            {muted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item, i) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{ animationDelay: `${i * 50}ms` }}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-slide-in-right",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-0.5",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary-foreground/80" />
                )}
                <Icon className={cn(
                  "w-4 h-4 transition-transform",
                  !active && "group-hover:scale-110",
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main key={location.pathname} className="flex-1 overflow-auto animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
