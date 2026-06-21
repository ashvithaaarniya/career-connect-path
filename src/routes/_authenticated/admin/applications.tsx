import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const STATUSES = ["pending", "shortlisted", "interview", "selected", "rejected"] as const;

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({ meta: [{ title: "Applications — Admin" }] }),
  component: AdminApps,
});

function AdminApps() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-apps"],
    queryFn: async () => (await supabase
      .from("applications")
      .select("id, status, applied_at, jobs(role, companies(name)), profiles!applications_student_id_fkey(full_name, email, department)")
      .order("applied_at", { ascending: false })).data ?? [],
  });

  const update = async (id: string, status: any) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-apps"] });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Applications</h1>
      <Card className="glass border-0">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead>
                <TableHead>Role</TableHead><TableHead>Company</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.profiles?.full_name ?? "—"}</TableCell>
                  <TableCell>{a.profiles?.email}</TableCell>
                  <TableCell>{a.profiles?.department ?? "—"}</TableCell>
                  <TableCell>{a.jobs?.role}</TableCell>
                  <TableCell>{a.jobs?.companies?.name}</TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => update(a.id, v)}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}