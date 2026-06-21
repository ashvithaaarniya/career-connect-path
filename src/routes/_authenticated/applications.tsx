import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["pending", "shortlisted", "interview", "selected", "rejected"] as const;
const colors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  shortlisted: "bg-[oklch(0.78_0.15_205)/0.25] text-[oklch(0.4_0.15_205)]",
  interview: "bg-[oklch(0.7_0.2_50)/0.25] text-[oklch(0.45_0.2_50)]",
  selected: "bg-[oklch(0.78_0.17_165)/0.25] text-[oklch(0.4_0.17_165)]",
  rejected: "bg-destructive/15 text-destructive",
};

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({ meta: [{ title: "Applications — CareerConnect" }] }),
  component: AppsPage,
});

function AppsPage() {
  const { user } = useAuth();
  const { data: apps } = useQuery({
    queryKey: ["apps-full", user?.id],
    queryFn: async () => (await supabase.from("applications").select("*, jobs(role, salary_package, companies(name))").eq("student_id", user!.id).order("applied_at", { ascending: false })).data ?? [],
    enabled: !!user,
  });

  const grouped = STATUSES.map((s) => ({ s, items: (apps ?? []).filter((a) => a.status === s) }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Track your applications</h1>
      <div className="grid gap-4 lg:grid-cols-5">
        {grouped.map((g) => (
          <div key={g.s} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold capitalize">{g.s}</h3>
              <Badge variant="secondary">{g.items.length}</Badge>
            </div>
            <div className="space-y-2">
              {g.items.length === 0 && <div className="rounded-xl border border-dashed border-border/40 p-3 text-center text-xs text-muted-foreground">Empty</div>}
              {g.items.map((a: any) => (
                <Card key={a.id} className="glass border-0">
                  <CardContent className="p-3">
                    <div className="text-sm font-semibold">{a.jobs?.role}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{a.jobs?.companies?.name}</div>
                    <div className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${colors[a.status]}`}>{a.status}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}