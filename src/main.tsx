import { ViteReactSSG } from "vite-react-ssg";
import { HelmetProvider } from "react-helmet-async";
import { routes } from "./routes";
import "./index.css";

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes, isClient, initialState }) => {
    // No-op setup hook; HelmetProvider is applied via rootContainer below.
  },
  {
    rootContainer: "#root",
    transformState(state) {
      return state;
    },
  }
);
