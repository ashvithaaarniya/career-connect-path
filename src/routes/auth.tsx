import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { GraduationCap, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const search = z.object({ tab: z.enum(["login", "signup", "admin"]).catch("login") });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Sign in — CareerConnect" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
    }
  }, [loading, user, role, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="hero-orb pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 opacity-50" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 py-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-lg">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">Career<span className="text-brand-gradient">Connect</span></span>
        </div>

        <div className="glass rounded-2xl p-6">
          <Tabs defaultValue={tab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginForm /></TabsContent>
            <TabsContent value="signup"><SignupForm /></TabsContent>
            <TabsContent value="admin"><AdminLoginForm /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
  };
  return (
    <Button type="button" variant="outline" className="w-full" onClick={onGoogle}>
      <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.7 0 19.5-8.5 19.5-19.5 0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-1.9 13.4-5l-6.2-5.2c-1.9 1.4-4.4 2.2-7.2 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39 16.3 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.5l6.2 5.2c-.4.4 6.6-4.8 6.6-14.7 0-1.2-.1-2.3-.4-3.5z"/></svg>
      {label}
    </Button>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <GoogleButton label="Continue with Google" />
      <div className="relative my-2 text-center text-xs text-muted-foreground"><span className="bg-card/0 px-2">or with email</span></div>
      <div className="grid gap-2"><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="grid gap-2"><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Link to="/forgot-password" className="text-right text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link>
      <Button disabled={loading} className="bg-brand-gradient border-0 text-white">{loading ? "Signing in..." : "Sign in"}</Button>
    </form>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin + "/dashboard" },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — redirecting...");
    navigate({ to: "/dashboard" });
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <GoogleButton label="Sign up with Google" />
      <div className="relative my-2 text-center text-xs text-muted-foreground"><span>or with email</span></div>
      <div className="grid gap-2"><Label>Full name</Label><Input required value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
      <div className="grid gap-2"><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="grid gap-2"><Label>Password</Label><Input type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button disabled={loading} className="bg-brand-gradient border-0 text-white">{loading ? "Creating..." : "Create student account"}</Button>
    </form>
  );
}

function AdminLoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setLoading(false); return toast.error(error.message); }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user!.id).eq("role", "admin");
    setLoading(false);
    if (!roles?.length) { await supabase.auth.signOut(); return toast.error("This account is not an admin."); }
    toast.success("Welcome admin");
    navigate({ to: "/admin" });
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-[oklch(0.7_0.17_200)]" /> Admin access requires an authorized account.
      </div>
      <div className="grid gap-2"><Label>Admin email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="grid gap-2"><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button disabled={loading} className="bg-brand-gradient border-0 text-white">{loading ? "Verifying..." : "Sign in as admin"}</Button>
    </form>
  );
}