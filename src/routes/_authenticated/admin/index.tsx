import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Briefcase, FileText, Trophy, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — CareerConnect" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [students, companies, jobs, apps, selected] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "selected"),
      ]);
      return {
        students: students.count ?? 0,
        companies: companies.count ?? 0,
        jobs: jobs.count ?? 0,
        apps: apps.count ?? 0,
        selected: selected.count ?? 0,
      };
    },
  });

  const { data: byDept } = useQuery({
    queryKey: ["dept-placement"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("status, profiles!inner(department)")
        .eq("status", "selected");
      const map = new Map<string, number>();
      (data ?? []).forEach((r: any) => {
        const d = r.profiles?.department ?? "Unknown";
        map.set(d, (map.get(d) ?? 0) + 1);
      });
      return Array.from(map, ([department, count]) => ({ department, count }));
    },
  });

  const { data: byStatus } = useQuery({
    queryKey: ["status-dist"],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("status");
      const map = new Map<string, number>();
      (data ?? []).forEach((r) => map.set(r.status, (map.get(r.status) ?? 0) + 1));
      return Array.from(map, ([name, value]) => ({ name, value }));
    },
  });

  const pct = stats?.apps ? Math.round((stats.selected / stats.apps) * 100) : 0;
  const cards = [
    { label: "Total Students", value: stats?.students ?? 0, icon: Users },
    { label: "Total Companies", value: stats?.companies ?? 0, icon: Building2 },
    { label: "Total Jobs", value: stats?.jobs ?? 0, icon: Briefcase },
    { label: "Applications", value: stats?.apps ?? 0, icon: FileText },
    { label: "Selections", value: stats?.selected ?? 0, icon: Trophy },
    { label: "Placement %", value: `${pct}%`, icon: TrendingUp },
  ];
  const colors = ["oklch(0.58 0.22 265)", "oklch(0.7 0.17 200)", "oklch(0.62 0.22 305)", "oklch(0.78 0.17 165)", "oklch(0.72 0.2 50)"];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Card key={c.label} className="glass border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <div className="text-xs font-medium">{c.label}</div>
                <c.icon className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-0">
          <CardHeader><CardTitle>Placements by department</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={byDept ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="department" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="oklch(0.58 0.22 265)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader><CardTitle>Application status distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byStatus ?? []} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {(byStatus ?? []).map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}