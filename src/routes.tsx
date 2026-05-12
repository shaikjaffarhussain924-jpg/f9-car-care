import type { RouteRecord } from "vite-react-ssg";
import { lazy } from "react";
import Layout from "./Layout";
import Index from "./pages/Index";
import { servicePages } from "./data/servicePages";

const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const Contact = lazy(() => import("./pages/Contact"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin routes are client-only (require localStorage / auth) and excluded
// from static prerendering.
const isServer = typeof window === "undefined";
const adminChildren: RouteRecord[] = isServer
  ? []
  : [
      {
        path: "admin/login",
        Component: lazy(() => import("./pages/admin/AdminLogin")),
      },
      {
        path: "admin",
        Component: lazy(() => import("./pages/admin/AdminLayout")),
        children: [
          {
            index: true,
            Component: lazy(() => import("./pages/admin/AdminDashboard")),
          },
          {
            path: "appointments",
            Component: lazy(() => import("./pages/admin/AdminAppointments")),
          },
          {
            path: "contacts",
            Component: lazy(() => import("./pages/admin/AdminContacts")),
          },
        ],
      },
    ];

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Index, entry: "src/pages/Index.tsx" },
      { path: "book", Component: BookAppointment },
      { path: "contact", Component: Contact },
      { path: "privacy-policy", Component: PrivacyPolicy },
      {
        path: "services/:slug",
        Component: ServicePage,
        getStaticPaths: () =>
          servicePages.map((s) => `/services/${s.slug}`),
      },
      ...adminChildren,
      { path: "*", Component: NotFound },
    ],
  },
];
