import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
  component: Analytics,
});

function Analytics() {
  const { data: monthly } = useQuery({
    queryKey: ["monthly-placements"],
    queryFn: async () => {
      const since = new Date(); since.setMonth(since.getMonth() - 11);
      const { data } = await supabase
        .from("applications")
        .select("applied_at, status")
        .gte("applied_at", since.toISOString());
      const buckets = new Map<string, { month: string; applications: number; selections: number }>();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const k = d.toLocaleString("en", { month: "short", year: "2-digit" });
        buckets.set(k, { month: k, applications: 0, selections: 0 });
      }
      (data ?? []).forEach((r) => {
        const k = new Date(r.applied_at).toLocaleString("en", { month: "short", year: "2-digit" });
        const b = buckets.get(k); if (!b) return;
        b.applications++; if (r.status === "selected") b.selections++;
      });
      return Array.from(buckets.values());
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Placement analytics</h1>
      <Card className="glass border-0">
        <CardHeader><CardTitle>Monthly trend</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <AreaChart data={monthly ?? []}>
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.58 0.22 265)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.58 0.22 265)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip />
              <Area type="monotone" dataKey="applications" stroke="oklch(0.58 0.22 265)" fill="url(#g1)" />
              <Area type="monotone" dataKey="selections" stroke="oklch(0.78 0.17 165)" fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}