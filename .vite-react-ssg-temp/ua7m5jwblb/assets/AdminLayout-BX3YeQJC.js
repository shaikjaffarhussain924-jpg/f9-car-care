import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { s as supabase, e as cn, B as Button } from "../main.mjs";
import { BellRing, MessageSquare, Loader2, BellOff, Bell, LogOut, LayoutDashboard, Calendar } from "lucide-react";
import { toast } from "sonner";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "prop-types";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "framer-motion";
import "embla-carousel-react";
import "@radix-ui/react-slot";
import "date-fns";
import "react-day-picker";
import "@radix-ui/react-popover";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@supabase/supabase-js";
import "@radix-ui/react-accordion";
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState(null);
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
        _user_id: session.user.id
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
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("admin-sound-muted") === "1";
  });
  useEffect(() => {
    localStorage.setItem("admin-sound-muted", muted ? "1" : "0");
  }, [muted]);
  useEffect(() => {
    if (!authorized) return;
    const PING_SRC = "data:audio/wav;base64,UklGRlwEAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YTgEAAAAAP8AAQD+AAIA/QADAPwABAD7AAUA+gAGAPkABwD4AAgA9wAJAPYACgD1AAsA9AAMAPMADQDyAA4A8QAPAPAAEADvABEA7gASAO0AEwDsABQA6wAVAOoAFgDpABcA6AAYAOcAGQDmABoA5QAbAOQAHADjAB0A4gAeAOEAHwDgACAA3wAhAN4AIgDdACMA3AAkANsAJQDaACYA2QAnANgAKADXACkA1gAqANUAKwDUACwA0wAtANIALgDRAC8A0AAwAM8AMQDOADIAzQAzAMwANADLADUAygA2AMkANwDIADgAxwA5AMYAOgDFADsAxAA8AMMAPQDCAD4AwQA/AMAAQAC/AEEAvgBCAL0AQwC8AEQAuwBFALoARgC5AEcAuABIALcASQC2AEoAtQBLALQATAC0AE0AswBOALIATwCxAFAAsABRAK8AUgCuAFMArQBUAKwAVQCrAFYAqgBXAKkAWACoAFkApwBaAKYAWwClAFwApABdAKMAXgCiAF8AoQBgAKAAYQCfAGIAngBjAJ0AZACcAGUAmwBmAJoAZwCZAGgAmABpAJcAagCWAGsAlQBsAJQAbQCTAG4AkgBvAJEAcACQAHEAjwByAI4AcwCNAHQAjAB1AIsAdgCKAHcAiQB4AIgAeQCHAHoAhgB7AIUAfACEAH0AgwB+AIIAfwCBAIAAgACBAH8AggB+AIMAfQCEAHwAhQB7AIYAegCHAHkAiAB4AIkAdwCKAHYAiwB1AIwAdACNAHMAjgByAI8AcQCQAHAAkQBvAJIAbgCTAG0AlABsAJUAawCWAGoAlwBpAJgAaACZAGcAmgBmAJsAZQCcAGQAnQBjAJ4AYgCfAGEAoABgAKEAXwCiAF4AowBdAKQAXACpAFsAqgBaAKsAWQCsAFgArQBXAK4AVgCvAFUAsABUALEAUwCyAFIAswBRALQAUACyAE8AswBOALQATQC1AEwAtgBLALcASgC4AEkAuQBIALoARwC7AEYAvABFAL0ARAC+AEMAvwBCAMAAQQDBAEAAwgA/AMMAPgDEAD0AxQA8AMYAOwDHADoAyAA5AMkAOADKADcAywA2AMwANQDNADQAzgAzAM8AMgDQADEA0QAwANIALwDTAC4A1AAtANUALADWACsA1wAqANgAKQDZACgA2gAnANsAJgDcACUA3QAkAN4AIwDfACIA4AAhAOEAIADiAB8A4wAeAOQAHQDlABwA5gAbAOcAGgDoABkA6QAYAOoAFwDrABYA7AAVAO0AFADuABMA7wASAPAAEQDxABAA8gAPAPMADgD0AA0A9QAMAPYACwD3AAoA+AAJAPkACAD6AAcA+wAGAPwABQD9AAQA/gADAP8AAgAA";
    const audio = new Audio(PING_SRC);
    audio.volume = 0.4;
    const playChime = () => {
      if (localStorage.getItem("admin-sound-muted") === "1") return;
      audio.currentTime = 0;
      audio.play().catch(() => {
      });
    };
    const channel = supabase.channel("admin-global-feed").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "appointments" },
      (payload) => {
        const row = payload.new;
        playChime();
        toast.success("New booking received!", {
          description: `${row.name} · ${row.service ?? "service"}${row.preferred_date ? ` · ${row.preferred_date}` : ""}`,
          icon: /* @__PURE__ */ jsx(BellRing, { className: "w-4 h-4" }),
          action: { label: "View", onClick: () => navigate("/admin/appointments") },
          duration: 8e3
        });
      }
    ).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "contact_submissions" },
      (payload) => {
        const row = payload.new;
        playChime();
        toast("New contact message", {
          description: `${row.name} — ${(row.message ?? "").slice(0, 60)}…`,
          icon: /* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4" }),
          action: { label: "Open", onClick: () => navigate("/admin/contacts") },
          duration: 8e3
        });
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authorized, navigate]);
  if (checking) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-muted-foreground" }) });
  }
  if (!authorized) return null;
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/appointments", label: "Appointments", icon: Calendar },
    { to: "/admin/contacts", label: "Contacts", icon: MessageSquare }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden md:flex w-64 border-r border-border bg-gradient-to-b from-card to-card/60 backdrop-blur flex-col animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-5 border-b border-border flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-heading font-bold text-primary-foreground shadow-lg shadow-primary/20", children: "F9" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-heading text-sm font-bold tracking-tight", children: "CRM Console" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: email })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              const next = !muted;
              setMuted(next);
              toast(next ? "Notifications muted" : "Notifications unmuted", {
                icon: next ? /* @__PURE__ */ jsx(BellOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }),
                duration: 2e3
              });
            },
            className: cn(
              "p-1.5 rounded-md transition-colors",
              muted ? "text-muted-foreground hover:bg-secondary" : "text-primary hover:bg-primary/10"
            ),
            "aria-label": muted ? "Unmute notifications" : "Mute notifications",
            title: muted ? "Unmute notifications" : "Mute notifications",
            children: muted ? /* @__PURE__ */ jsx(BellOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 px-2 py-4 space-y-1", children: navItems.map((item, i) => {
        const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            style: { animationDelay: `${i * 50}ms` },
            className: cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-slide-in-right",
              active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-0.5"
            ),
            children: [
              active && /* @__PURE__ */ jsx("span", { className: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary-foreground/80" }),
              /* @__PURE__ */ jsx(Icon, { className: cn(
                "w-4 h-4 transition-transform",
                !active && "group-hover:scale-110"
              ) }),
              item.label
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-border", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors",
          onClick: handleLogout,
          children: [
            /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
            " Sign out"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("header", { className: "md:hidden fixed top-0 left-0 right-0 z-40 h-14 px-4 flex items-center justify-between bg-card/95 backdrop-blur border-b border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-heading font-bold text-primary-foreground text-xs shadow-md shadow-primary/20", children: "F9" }),
        /* @__PURE__ */ jsx("div", { className: "font-heading text-sm font-bold tracking-tight", children: "CRM Console" })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-9 w-9 hover:bg-destructive/10 hover:text-destructive",
          onClick: handleLogout,
          "aria-label": "Sign out",
          children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-card/95 backdrop-blur border-t border-border flex", children: [
      navItems.map((item) => {
        const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsx(Icon, { className: cn("w-5 h-5", active && "scale-110 transition-transform") }),
              item.label
            ]
          },
          item.to
        );
      }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            const next = !muted;
            setMuted(next);
            toast(next ? "Notifications muted" : "Notifications unmuted", {
              icon: next ? /* @__PURE__ */ jsx(BellOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }),
              duration: 2e3
            });
          },
          className: cn(
            "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
            muted ? "text-muted-foreground" : "text-primary"
          ),
          "aria-label": muted ? "Unmute notifications" : "Mute notifications",
          children: [
            muted ? /* @__PURE__ */ jsx(BellOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }),
            muted ? "Muted" : "Alerts"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto animate-fade-in pt-14 pb-16 md:pt-0 md:pb-0", children: /* @__PURE__ */ jsx(Outlet, {}) }, location.pathname)
  ] });
}
export {
  AdminLayout as default
};
