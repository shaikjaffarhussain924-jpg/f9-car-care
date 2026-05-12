import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-CJtFN4ff.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-Uj2s_YfI.js";
import { Calendar, Users, Clock, CheckCircle2, XCircle, MessageSquare, Loader2, TrendingUp } from "lucide-react";
import { c as cn } from "../main.mjs";
import { format } from "date-fns";
import * as RechartsPrimitive from "recharts";
import { AreaChart, CartesianGrid, XAxis, YAxis, Area } from "recharts";
import "@supabase/supabase-js";
import "vite-react-ssg";
import "react-router-dom";
import "react-helmet-async";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "framer-motion";
import "embla-carousel-react";
import "@radix-ui/react-slot";
const THEMES = { light: "", dark: ".dark" };
const ChartContext = React.createContext(null);
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx(ChartContext.Provider, { value: { config }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-chart": chartId,
      ref,
      className: cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChartStyle, { id: chartId, config }),
        /* @__PURE__ */ jsx(RechartsPrimitive.ResponsiveContainer, { children })
      ]
    }
  ) });
});
ChartContainer.displayName = "Chart";
const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(([_, config2]) => config2.theme || config2.color);
  if (!colorConfig.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
            var _a;
            const color = ((_a = itemConfig.theme) == null ? void 0 : _a[theme]) || itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).join("\n")}
}
`
        ).join("\n")
      }
    }
  );
};
const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartTooltipContent = React.forwardRef(
  ({
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey
  }, ref) => {
    const { config } = useChart();
    const tooltipLabel = React.useMemo(() => {
      var _a;
      if (hideLabel || !(payload == null ? void 0 : payload.length)) {
        return null;
      }
      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value = !labelKey && typeof label === "string" ? ((_a = config[label]) == null ? void 0 : _a.label) || label : itemConfig == null ? void 0 : itemConfig.label;
      if (labelFormatter) {
        return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: labelFormatter(value, payload) });
      }
      if (!value) {
        return null;
      }
      return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: value });
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);
    if (!active || !(payload == null ? void 0 : payload.length)) {
      return null;
    }
    const nestLabel = payload.length === 1 && indicator !== "dot";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        ),
        children: [
          !nestLabel ? tooltipLabel : null,
          /* @__PURE__ */ jsx("div", { className: "grid gap-1.5", children: payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                ),
                children: formatter && (item == null ? void 0 : item.value) !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  (itemConfig == null ? void 0 : itemConfig.icon) ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed"
                      }),
                      style: {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
                          nestLabel ? tooltipLabel : null,
                          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: (itemConfig == null ? void 0 : itemConfig.label) || item.name })
                        ] }),
                        item.value && /* @__PURE__ */ jsx("span", { className: "font-mono font-medium tabular-nums text-foreground", children: item.value.toLocaleString() })
                      ]
                    }
                  )
                ] })
              },
              item.dataKey
            );
          }) })
        ]
      }
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";
const ChartLegendContent = React.forwardRef(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();
  if (!(payload == null ? void 0 : payload.length)) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className),
      children: payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"),
            children: [
              (itemConfig == null ? void 0 : itemConfig.icon) && !hideIcon ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-2 w-2 shrink-0 rounded-[2px]",
                  style: {
                    backgroundColor: item.color
                  }
                }
              ),
              itemConfig == null ? void 0 : itemConfig.label
            ]
          },
          item.value
        );
      })
    }
  );
});
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) {
    return void 0;
  }
  const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
  let configLabelKey = key;
  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}
const bookingsChartConfig = {
  count: { label: "Bookings", color: "hsl(217 91% 60%)" }
};
function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayBookings: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    newContacts: 0
  });
  const [loading, setLoading] = useState(true);
  const [bookingsOverTime, setBookingsOverTime] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const loadData = async () => {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();
    const since = /* @__PURE__ */ new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);
    const sinceIso = since.toISOString();
    const now = /* @__PURE__ */ new Date();
    const in24 = new Date(now.getTime() + 24 * 60 * 60 * 1e3);
    const todayStr = format(now, "yyyy-MM-dd");
    const next24Str = format(in24, "yyyy-MM-dd");
    const [total, todayCount, pending, completed, cancelled, contacts, chartRows, upcomingRows] = await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id", { count: "exact", head: true }).gte("created_at", todayIso),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "cancelled"),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("appointments").select("created_at").gte("created_at", sinceIso),
      supabase.from("appointments").select("id, name, service, preferred_date, preferred_time, status").in("status", ["pending", "confirmed"]).gte("preferred_date", todayStr).lte("preferred_date", next24Str).order("preferred_date", { ascending: true }).order("preferred_time", { ascending: true }).limit(8)
    ]);
    setStats({
      totalAppointments: total.count ?? 0,
      todayBookings: todayCount.count ?? 0,
      pending: pending.count ?? 0,
      completed: completed.count ?? 0,
      cancelled: cancelled.count ?? 0,
      newContacts: contacts.count ?? 0
    });
    setUpcoming(upcomingRows.data ?? []);
    const counts = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      counts[d.toISOString().slice(0, 10)] = 0;
    }
    (chartRows.data ?? []).forEach((r) => {
      const k = r.created_at.slice(0, 10);
      if (k in counts) counts[k]++;
    });
    setBookingsOverTime(Object.entries(counts).map(([date, count]) => ({ date, count })));
    setLoading(false);
  };
  useEffect(() => {
    loadData();
    const channel = supabase.channel("dashboard-feed").on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => loadData()).on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, () => loadData()).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const cards = [
    { label: "Total Appointments", value: stats.totalAppointments, icon: Calendar, tile: "bg-amber-100 text-amber-700" },
    { label: "Today's Bookings", value: stats.todayBookings, icon: Users, tile: "bg-emerald-100 text-emerald-700" },
    { label: "Pending", value: stats.pending, icon: Clock, tile: "bg-orange-100 text-orange-700" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, tile: "bg-green-100 text-green-700" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, tile: "bg-rose-100 text-rose-700" },
    { label: "New Contacts", value: stats.newContacts, icon: MessageSquare, tile: "bg-violet-100 text-violet-700" }
  ];
  const statusPill = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800"
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-heading text-3xl md:text-4xl font-bold tracking-tight mb-6 animate-fade-in", children: "Dashboard" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-16", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6", children: cards.map((c, i) => {
        const Icon = c.icon;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            style: { animationDelay: `${i * 40}ms` },
            className: "bg-card border border-border rounded-2xl p-4 animate-fade-in hover:shadow-md transition-shadow",
            children: [
              /* @__PURE__ */ jsx("div", { className: cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", c.tile), children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold tracking-tight tabular-nums", children: c.value }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1", children: c.label })
            ]
          },
          c.label
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-2 border-border rounded-2xl", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center gap-2 pb-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-foreground" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Bookings — Last 30 Days" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ChartContainer, { config: bookingsChartConfig, className: "h-[280px] w-full", children: /* @__PURE__ */ jsxs(AreaChart, { data: bookingsOverTime, margin: { top: 5, right: 10, left: -20, bottom: 0 }, children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "fillBookings", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "var(--color-count)", stopOpacity: 0.4 }),
              /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "var(--color-count)", stopOpacity: 0 })
            ] }) }),
            /* @__PURE__ */ jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
            /* @__PURE__ */ jsx(
              XAxis,
              {
                dataKey: "date",
                tickLine: false,
                axisLine: false,
                tickFormatter: (v) => {
                  const d = /* @__PURE__ */ new Date(v + "T00:00:00");
                  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                },
                interval: 4,
                fontSize: 11,
                stroke: "hsl(var(--muted-foreground))"
              }
            ),
            /* @__PURE__ */ jsx(
              YAxis,
              {
                tickLine: false,
                axisLine: false,
                allowDecimals: false,
                fontSize: 11,
                stroke: "hsl(var(--muted-foreground))"
              }
            ),
            /* @__PURE__ */ jsx(
              ChartTooltip,
              {
                content: /* @__PURE__ */ jsx(
                  ChartTooltipContent,
                  {
                    labelFormatter: (v) => {
                      const d = /* @__PURE__ */ new Date(v + "T00:00:00");
                      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              Area,
              {
                type: "monotone",
                dataKey: "count",
                stroke: "var(--color-count)",
                fill: "url(#fillBookings)",
                strokeWidth: 2
              }
            )
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-border rounded-2xl", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center gap-2 pb-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-foreground" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Upcoming (24h)" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: upcoming.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground p-6 text-center", children: "No upcoming appointments." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: upcoming.map((r, i) => {
            var _a, _b;
            return /* @__PURE__ */ jsxs(
              "li",
              {
                style: { animationDelay: `${i * 40}ms` },
                className: "flex items-start gap-3 px-5 py-3 animate-fade-in",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-9 h-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-foreground", children: ((_b = (_a = r.name) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) ?? "?" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold truncate", children: r.name }),
                      /* @__PURE__ */ jsx("span", { className: cn(
                        "text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full whitespace-nowrap",
                        statusPill[r.status] ?? "bg-muted"
                      ), children: r.status })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground truncate", children: r.service ?? "—" }),
                    /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      r.preferred_date ? format(new Date(r.preferred_date), "d MMM") : "—",
                      r.preferred_time ? ` · ${r.preferred_time}` : ""
                    ] })
                  ] })
                ]
              },
              r.id
            );
          }) }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminDashboard as default
};
