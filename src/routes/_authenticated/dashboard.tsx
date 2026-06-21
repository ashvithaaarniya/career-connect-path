import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Bookmark, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerConnect" }] }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
    enabled: !!user,
  });
  const { data: apps } = useQuery({
    queryKey: ["apps", user?.id],
    queryFn: async () => (await supabase.from("applications").select("status").eq("student_id", user!.id)).data ?? [],
    enabled: !!user,
  });
  const { data: saved } = useQuery({
    queryKey: ["saved", user?.id],
    queryFn: async () => (await supabase.from("saved_jobs").select("id").eq("user_id", user!.id)).data ?? [],
    enabled: !!user,
  });
  const { data: jobs } = useQuery({
    queryKey: ["jobs-recent"],
    queryFn: async () => (await supabase.from("jobs").select("id, role, salary_package, location, companies(name)").order("posted_at", { ascending: false }).limit(5)).data ?? [],
  });

  const total = apps?.length ?? 0;
  const shortlisted = apps?.filter((a) => a.status === "shortlisted" || a.status === "interview" || a.status === "selected").length ?? 0;
  const selected = apps?.filter((a) => a.status === "selected").length ?? 0;
  const strength = profileStrength(profile);

  const cards = [
    { label: "Applications", value: total, icon: FileText },
    { label: "Shortlisted", value: shortlisted, icon: TrendingUp },
    { label: "Saved Jobs", value: saved?.length ?? 0, icon: Bookmark },
    { label: "Offers", value: selected, icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(" ")[0] ?? "there"} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's a snapshot of your placement journey.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">{c.label}</div>
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 text-3xl font-bold">{c.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass border-0 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest opportunities</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/jobs">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(jobs ?? []).length === 0 && <div className="text-sm text-muted-foreground">No jobs posted yet. Check back soon.</div>}
            {(jobs ?? []).map((j: any) => (
              <Link key={j.id} to="/jobs" className="flex items-center justify-between rounded-xl border border-border/40 bg-card/40 p-3 hover:bg-muted/50">
                <div>
                  <div className="text-sm font-semibold">{j.role}</div>
                  <div className="text-xs text-muted-foreground">{j.companies?.name} • {j.location ?? "Remote"}</div>
                </div>
                <div className="text-xs font-medium text-brand-gradient">{j.salary_package ?? "Competitive"}</div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-[oklch(0.68_0.22_265)]" /> Profile strength</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{strength}<span className="text-base text-muted-foreground">/100</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-brand-gradient" style={{ width: `${strength}%` }} />
            </div>
            <Button asChild className="mt-4 w-full bg-brand-gradient border-0 text-white"><Link to="/profile">Improve profile</Link></Button>
            <Button asChild variant="outline" className="mt-2 w-full"><Link to="/ai-assistant">Chat with AI Coach</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function profileStrength(p: any) {
  if (!p) return 10;
  const fields = ["full_name", "phone", "college", "department", "cgpa", "graduation_year", "bio", "resume_url"];
  const filled = fields.filter((f) => p[f] !== null && p[f] !== "" && p[f] !== undefined).length;
  return Math.round((filled / fields.length) * 100);
}