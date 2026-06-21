import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck, MapPin, Search, Briefcase } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/jobs")({
  head: () => ({ meta: [{ title: "Jobs — CareerConnect" }] }),
  component: JobsPage,
});

function JobsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => (await supabase.from("jobs").select("*, companies(name, industry, location)").order("posted_at", { ascending: false })).data ?? [],
  });
  const { data: saved } = useQuery({
    queryKey: ["saved", user?.id],
    queryFn: async () => (await supabase.from("saved_jobs").select("job_id").eq("user_id", user!.id)).data ?? [],
    enabled: !!user,
  });
  const { data: apps } = useQuery({
    queryKey: ["apps-jobs", user?.id],
    queryFn: async () => (await supabase.from("applications").select("job_id").eq("student_id", user!.id)).data ?? [],
    enabled: !!user,
  });

  const savedIds = new Set(saved?.map((s) => s.job_id));
  const appliedIds = new Set(apps?.map((a) => a.job_id));

  const filtered = (jobs ?? []).filter((j: any) => {
    if (!q) return true;
    const t = q.toLowerCase();
    return j.role?.toLowerCase().includes(t) || j.companies?.name?.toLowerCase().includes(t) || j.location?.toLowerCase().includes(t);
  });

  const apply = async (job_id: string) => {
    const { error } = await supabase.from("applications").insert({ job_id, student_id: user!.id });
    if (error) return toast.error(error.message);
    toast.success("Application submitted");
    qc.invalidateQueries({ queryKey: ["apps-jobs"] });
  };
  const toggleSave = async (job_id: string) => {
    if (savedIds.has(job_id)) {
      await supabase.from("saved_jobs").delete().eq("user_id", user!.id).eq("job_id", job_id);
    } else {
      await supabase.from("saved_jobs").insert({ user_id: user!.id, job_id });
    }
    qc.invalidateQueries({ queryKey: ["saved"] });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Browse opportunities</h1>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search role, company, location" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <Card className="glass border-0"><CardContent className="py-12 text-center text-sm text-muted-foreground">No matching jobs yet.</CardContent></Card>
        )}
        {filtered.map((j: any) => (
          <Card key={j.id} className="glass border-0">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-lg font-semibold">{j.role}</h3>
                  <Badge variant="secondary" className="capitalize">{(j.job_type ?? "full_time").replace("_", " ")}</Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{j.companies?.name} • {j.companies?.industry}</div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.location ?? j.companies?.location ?? "—"}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {j.salary_package ?? "Competitive"}</span>
                  {j.eligibility_cgpa && <span>Min CGPA {j.eligibility_cgpa}</span>}
                  {j.last_date && <span>Apply by {j.last_date}</span>}
                </div>
                {j.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{j.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleSave(j.id)} aria-label="Save">
                  {savedIds.has(j.id) ? <BookmarkCheck className="h-4 w-4 text-[oklch(0.68_0.22_265)]" /> : <Bookmark className="h-4 w-4" />}
                </Button>
                <Button disabled={appliedIds.has(j.id)} onClick={() => apply(j.id)} className="bg-brand-gradient text-white border-0">
                  {appliedIds.has(j.id) ? "Applied" : "Apply Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}