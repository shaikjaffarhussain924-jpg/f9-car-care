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
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAppointments = lazy(() => import("./pages/admin/AdminAppointments"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));

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
        getStaticPaths: () => servicePages.map((s) => s.slug),
      },
      { path: "admin/login", Component: AdminLogin },
      {
        path: "admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "appointments", Component: AdminAppointments },
          { path: "contacts", Component: AdminContacts },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
];
