import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { u as useToast, s as supabase, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, L as Label, I as Input, B as Button } from "../main.mjs";
import { Loader2 } from "lucide-react";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "react-helmet-async";
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
function AdminLogin() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();
  useEffect(() => {
    if (params.get("denied")) {
      toast({
        title: "Access denied",
        description: "Your account doesn't have admin/staff access yet.",
        variant: "destructive"
      });
    }
  }, [params, toast]);
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: ok } = await supabase.rpc("is_admin_or_staff", { _user_id: session.user.id });
      if (ok) navigate("/admin", { replace: true });
    })();
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` }
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "Now ask the workspace owner to grant you admin access."
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      toast({
        title: "Authentication error",
        description: (err == null ? void 0 : err.message) ?? "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center bg-background p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxs(CardTitle, { children: [
        "F9 Admin ",
        mode === "signup" ? "Sign Up" : "Login"
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { children: mode === "signup" ? "Create an account, then have an admin grant you access." : "Sign in with your admin/staff credentials." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(Input, { id: "password", type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: busy, children: [
        busy && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }),
        mode === "signup" ? "Create account" : "Sign in"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-muted-foreground", children: mode === "signup" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx("button", { type: "button", className: "underline", onClick: () => setMode("signin"), children: "Sign in" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        "Need an account?",
        " ",
        /* @__PURE__ */ jsx("button", { type: "button", className: "underline", onClick: () => setMode("signup"), children: "Sign up" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-xs text-muted-foreground hover:text-foreground", children: "← Back to site" }) })
    ] }) })
  ] }) });
}
export {
  AdminLogin as default
};
