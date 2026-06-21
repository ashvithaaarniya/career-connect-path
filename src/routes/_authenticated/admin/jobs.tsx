import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/jobs")({
  head: () => ({ meta: [{ title: "Jobs — Admin" }] }),
  component: JobsAdmin,
});

function JobsAdmin() {
  const qc = useQueryClient();
  const { data: jobs } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => (await supabase.from("jobs").select("*, companies(name)").order("posted_at", { ascending: false })).data ?? [],
  });
  const { data: companies } = useQuery({
    queryKey: ["admin-companies-min"],
    queryFn: async () => (await supabase.from("companies").select("id, name").order("name")).data ?? [],
  });
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<any>({ job_type: "full_time" });

  const save = async () => {
    if (!f.company_id || !f.role) return toast.error("Company and role required");
    const payload: any = { ...f };
    if (payload.eligibility_cgpa) payload.eligibility_cgpa = Number(payload.eligibility_cgpa);
    if (!payload.last_date) delete payload.last_date;
    const { error } = await supabase.from("jobs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Job posted"); setF({ job_type: "full_time" }); setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-jobs"] });
  };
  const del = async (id: string) => {
    await supabase.from("jobs").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-jobs"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-brand-gradient text-white border-0"><Plus className="mr-1 h-4 w-4" /> Post job</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New job</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>Company</Label>
                <Select value={f.company_id} onValueChange={(v) => setF({ ...f, company_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {(companies ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5"><Label>Role</Label><Input value={f.role ?? ""} onChange={(e) => setF({ ...f, role: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Type</Label>
                  <Select value={f.job_type} onValueChange={(v) => setF({ ...f, job_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="part_time">Part time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5"><Label>Location</Label><Input value={f.location ?? ""} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Package</Label><Input value={f.salary_package ?? ""} onChange={(e) => setF({ ...f, salary_package: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Min CGPA</Label><Input type="number" step="0.1" value={f.eligibility_cgpa ?? ""} onChange={(e) => setF({ ...f, eligibility_cgpa: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Last date</Label><Input type="date" value={f.last_date ?? ""} onChange={(e) => setF({ ...f, last_date: e.target.value })} /></div>
              </div>
              <div className="grid gap-1.5"><Label>Required skills</Label><Input value={f.required_skills ?? ""} onChange={(e) => setF({ ...f, required_skills: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Description</Label><Textarea rows={3} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
              <Button onClick={save} className="bg-brand-gradient text-white border-0">Publish</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {(jobs ?? []).map((j: any) => (
          <Card key={j.id} className="glass border-0">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="font-semibold">{j.role}</div>
                <div className="text-xs text-muted-foreground">{j.companies?.name} • {j.location ?? "—"} • {j.salary_package ?? "—"}</div>
              </div>
              <button onClick={() => del(j.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}