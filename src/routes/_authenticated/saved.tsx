import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/saved")({
  head: () => ({ meta: [{ title: "Saved jobs — CareerConnect" }] }),
  component: () => {
    const { user } = useAuth();
    const { data } = useQuery({
      queryKey: ["saved-full", user?.id],
      queryFn: async () => (await supabase.from("saved_jobs").select("id, jobs(id, role, salary_package, location, companies(name))").eq("user_id", user!.id)).data ?? [],
      enabled: !!user,
    });
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Saved jobs</h1>
        {(data ?? []).length === 0 && (
          <Card className="glass border-0">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              You haven't saved any jobs yet. <Link to="/jobs" className="text-brand-gradient">Browse jobs</Link>.
            </CardContent>
          </Card>
        )}
        {(data ?? []).map((s: any) => (
          <Card key={s.id} className="glass border-0">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="font-semibold">{s.jobs?.role}</div>
                <div className="text-xs text-muted-foreground">{s.jobs?.companies?.name} • {s.jobs?.location ?? "—"}</div>
              </div>
              <Button asChild className="bg-brand-gradient text-white border-0"><Link to="/jobs">View</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  },
});