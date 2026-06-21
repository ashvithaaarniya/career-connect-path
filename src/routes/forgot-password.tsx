import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — CareerConnect" }] }),
  component: () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-12">
        <Link to="/auth" search={{ tab: "login" }} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
        <div className="glass rounded-2xl p-6">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We'll email you a secure link to reset it.</p>
          <form
            className="mt-6 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + "/reset-password",
              });
              setLoading(false);
              if (error) return toast.error(error.message);
              toast.success("Check your inbox for the reset link.");
            }}
          >
            <div className="grid gap-2"><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <Button disabled={loading} className="bg-brand-gradient border-0 text-white">{loading ? "Sending..." : "Send reset link"}</Button>
          </form>
        </div>
      </div>
    );
  },
});