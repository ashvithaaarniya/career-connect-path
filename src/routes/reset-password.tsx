import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — CareerConnect" }] }),
  component: () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-12">
        <div className="glass rounded-2xl p-6">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <form
            className="mt-6 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const { error } = await supabase.auth.updateUser({ password });
              setLoading(false);
              if (error) return toast.error(error.message);
              toast.success("Password updated");
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="grid gap-2"><Label>New password</Label><Input type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button disabled={loading} className="bg-brand-gradient border-0 text-white">{loading ? "Updating..." : "Update password"}</Button>
          </form>
        </div>
      </div>
    );
  },
});