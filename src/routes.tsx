import type { RouteRecord } from "vite-react-ssg";
import Layout from "./Layout";
import Index from "./pages/Index";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import ServicePage from "./pages/ServicePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import { servicePages } from "./data/servicePages";

// Admin routes are client-only (require browser auth) and excluded from SSG.
const isServer = typeof window === "undefined";

let adminChildren: RouteRecord[] = [];
if (!isServer) {
  // Lazy import keeps admin code out of the SSR bundle entirely.
  const { lazy } = await import("react");
  adminChildren = [
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
}

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Index, entry: "src/pages/Index.tsx" },
      { path: "book", Component: BookAppointment, entry: "src/pages/BookAppointment.tsx" },
      { path: "contact", Component: Contact, entry: "src/pages/Contact.tsx" },
      { path: "privacy-policy", Component: PrivacyPolicy, entry: "src/pages/PrivacyPolicy.tsx" },
      {
        path: "services/:slug",
        Component: ServicePage,
        entry: "src/pages/ServicePage.tsx",
        getStaticPaths: () =>
          servicePages.map((s) => `/services/${s.slug}`),
      },
      ...adminChildren,
      { path: "*", Component: NotFound },
    ],
  },
];
