import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/students")({
  head: () => ({ meta: [{ title: "Students — Admin" }] }),
  component: () => {
    const { data } = useQuery({
      queryKey: ["admin-students"],
      queryFn: async () => (await supabase.from("profiles").select("*").order("created_at", { ascending: false })).data ?? [],
    });
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Students</h1>
        <Card className="glass border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>College</TableHead>
                  <TableHead>Dept</TableHead><TableHead>CGPA</TableHead><TableHead>Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.full_name ?? "—"}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.college ?? "—"}</TableCell>
                    <TableCell>{s.department ?? "—"}</TableCell>
                    <TableCell>{s.cgpa ?? "—"}</TableCell>
                    <TableCell>{s.graduation_year ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  },
});