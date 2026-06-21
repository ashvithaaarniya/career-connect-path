import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/companies")({
  head: () => ({ meta: [{ title: "Companies — Admin" }] }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => (await supabase.from("companies").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<any>({});

  const save = async () => {
    if (!f.name) return toast.error("Name required");
    const { error } = await supabase.from("companies").insert(f);
    if (error) return toast.error(error.message);
    toast.success("Company added"); setF({}); setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-companies"] });
  };
  const del = async (id: string) => {
    await supabase.from("companies").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-companies"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-brand-gradient text-white border-0"><Plus className="mr-1 h-4 w-4" /> Add company</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New company</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              {[
                ["name", "Name"], ["industry", "Industry"], ["location", "Location"], ["website", "Website"],
              ].map(([k, l]) => (
                <div key={k} className="grid gap-1.5"><Label>{l}</Label><Input value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
              ))}
              <div className="grid gap-1.5"><Label>Description</Label><Textarea rows={3} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
              <Button onClick={save} className="bg-brand-gradient text-white border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((c) => (
          <Card key={c.id} className="glass border-0">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <div className="text-xs text-muted-foreground">{c.industry} • {c.location}</div>
                </div>
                <button onClick={() => del(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              {c.description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}