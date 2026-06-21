import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Plus, Trash2, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — CareerConnect" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
    enabled: !!user,
  });
  const { data: skills } = useQuery({
    queryKey: ["skills", user?.id],
    queryFn: async () => (await supabase.from("skills").select("*").eq("user_id", user!.id)).data ?? [],
    enabled: !!user,
  });
  const { data: projects } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => (await supabase.from("projects").select("*").eq("user_id", user!.id)).data ?? [],
    enabled: !!user,
  });
  const { data: certs } = useQuery({
    queryKey: ["certs", user?.id],
    queryFn: async () => (await supabase.from("certifications").select("*").eq("user_id", user!.id)).data ?? [],
    enabled: !!user,
  });

  const [form, setForm] = useState<any>({});
  useEffect(() => { if (profile) setForm(profile); }, [profile]);

  const save = async () => {
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, phone: form.phone, college: form.college, department: form.department,
      cgpa: form.cgpa ? Number(form.cgpa) : null, graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
      bio: form.bio,
    }).eq("id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    qc.invalidateQueries({ queryKey: ["profile"] });
  };

  const uploadResume = async (file: File) => {
    const path = `${user!.id}/resume-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    await supabase.from("profiles").update({ resume_url: path }).eq("id", user!.id);
    toast.success("Resume uploaded");
    qc.invalidateQueries({ queryKey: ["profile"] });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your profile</h1>

      <Card className="glass border-0">
        <CardHeader><CardTitle>Basic details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" v={form.full_name} on={(v) => setForm({ ...form, full_name: v })} />
          <Field label="Phone" v={form.phone} on={(v) => setForm({ ...form, phone: v })} />
          <Field label="College" v={form.college} on={(v) => setForm({ ...form, college: v })} />
          <Field label="Department" v={form.department} on={(v) => setForm({ ...form, department: v })} />
          <Field label="CGPA" type="number" v={form.cgpa} on={(v) => setForm({ ...form, cgpa: v })} />
          <Field label="Graduation Year" type="number" v={form.graduation_year} on={(v) => setForm({ ...form, graduation_year: v })} />
          <div className="sm:col-span-2 grid gap-2">
            <Label>About you</Label>
            <Textarea rows={3} value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="sm:col-span-2"><Button onClick={save} className="bg-brand-gradient border-0 text-white">Save changes</Button></div>
        </CardContent>
      </Card>

      <Card className="glass border-0">
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> Resume</CardTitle></CardHeader>
        <CardContent>
          {profile?.resume_url ? (
            <div className="text-sm text-muted-foreground">Uploaded: {profile.resume_url.split("/").pop()}</div>
          ) : (
            <div className="text-sm text-muted-foreground">No resume yet. Upload a PDF or DOCX.</div>
          )}
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm hover:bg-muted">
            <Upload className="h-4 w-4" /> Upload resume
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => e.target.files && uploadResume(e.target.files[0])} />
          </label>
        </CardContent>
      </Card>

      <ChildList
        title="Skills"
        items={skills ?? []}
        render={(s) => <Badge variant="secondary">{s.name}{s.level ? ` • ${s.level}` : ""}</Badge>}
        addLabel="Add skill"
        fields={[{ key: "name", label: "Skill name", required: true }, { key: "level", label: "Level (e.g. Intermediate)" }]}
        table="skills"
      />
      <ChildList
        title="Projects"
        items={projects ?? []}
        render={(p) => (
          <div>
            <div className="text-sm font-semibold">{p.title}</div>
            <div className="text-xs text-muted-foreground">{p.description}</div>
            {p.link && <a className="text-xs text-brand-gradient" href={p.link} target="_blank" rel="noreferrer">{p.link}</a>}
          </div>
        )}
        addLabel="Add project"
        fields={[
          { key: "title", label: "Title", required: true },
          { key: "description", label: "Description" },
          { key: "tech", label: "Tech stack" },
          { key: "link", label: "Link" },
        ]}
        table="projects"
      />
      <ChildList
        title="Certifications"
        items={certs ?? []}
        render={(c) => (
          <div>
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.issuer}{c.issue_date ? ` • ${c.issue_date}` : ""}</div>
          </div>
        )}
        addLabel="Add certification"
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "issuer", label: "Issuer" },
          { key: "issue_date", label: "Issue date", type: "date" },
          { key: "credential_url", label: "Credential URL" },
        ]}
        table="certifications"
      />
    </div>
  );
}

function Field({ label, v, on, type = "text" }: any) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input type={type} value={v ?? ""} onChange={(e) => on(e.target.value)} />
    </div>
  );
}

function ChildList({
  title, items, render, addLabel, fields, table,
}: {
  title: string; items: any[]; render: (it: any) => any; addLabel: string;
  fields: { key: string; label: string; required?: boolean; type?: string }[]; table: "skills" | "projects" | "certifications";
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const add = async () => {
    const row: any = { user_id: user!.id };
    for (const f of fields) row[f.key] = draft[f.key] || null;
    const { error } = await supabase.from(table).insert(row);
    if (error) return toast.error(error.message);
    setDraft({}); setAdding(false);
    qc.invalidateQueries({ queryKey: [table === "skills" ? "skills" : table === "projects" ? "projects" : "certs"] });
  };
  const del = async (id: string) => {
    await supabase.from(table).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: [table === "skills" ? "skills" : table === "projects" ? "projects" : "certs"] });
  };

  return (
    <Card className="glass border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button size="sm" variant="ghost" onClick={() => setAdding((a) => !a)}><Plus className="mr-1 h-4 w-4" /> {addLabel}</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="grid gap-3 rounded-xl border border-border/40 bg-card/40 p-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className="grid gap-1.5">
                <Label className="text-xs">{f.label}</Label>
                <Input type={f.type ?? "text"} value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
              </div>
            ))}
            <div className="sm:col-span-2 flex gap-2"><Button size="sm" onClick={add} className="bg-brand-gradient text-white border-0">Save</Button><Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button></div>
          </div>
        )}
        {items.length === 0 && <div className="text-sm text-muted-foreground">Nothing here yet.</div>}
        <div className="flex flex-wrap gap-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 p-3">
              <div>{render(it)}</div>
              <button onClick={() => del(it.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}