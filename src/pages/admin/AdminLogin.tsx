import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type Mode = "signin" | "signup";

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>("signin");
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
        variant: "destructive",
      });
    }
  }, [params, toast]);

  // If already signed in with a role, redirect
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: ok } = await supabase.rpc("is_admin_or_staff", { _user_id: session.user.id });
      if (ok) navigate("/admin", { replace: true });
    })();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "Now ask the workspace owner to grant you admin access.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin", { replace: true });
      }
    } catch (err: any) {
      toast({
        title: "Authentication error",
        description: err?.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>F9 Admin {mode === "signup" ? "Sign Up" : "Login"}</CardTitle>
          <CardDescription>
            {mode === "signup"
              ? "Create an account, then have an admin grant you access."
              : "Sign in with your admin/staff credentials."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button type="button" className="underline" onClick={() => setMode("signin")}>Sign in</button>
                </>
              ) : (
                <>
                  Need an account?{" "}
                  <button type="button" className="underline" onClick={() => setMode("signup")}>Sign up</button>
                </>
              )}
            </div>
            <div className="text-center">
              <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
