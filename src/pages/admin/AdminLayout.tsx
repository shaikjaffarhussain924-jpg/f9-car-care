import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Calendar, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <aside className="w-60 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="font-heading text-lg font-bold tracking-tight">F9 CRM</div>
          <div className="text-xs text-muted-foreground truncate">{email}</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
