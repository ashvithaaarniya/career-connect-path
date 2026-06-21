import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, LayoutDashboard, UserCircle, Briefcase, FileText,
  Bookmark, Bot, LogOut, Moon, Sun, Users, Building2, BarChart3, ClipboardList,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/saved", label: "Saved Jobs", icon: Bookmark },
  { to: "/ai-assistant", label: "AI Coach", icon: Bot },
] as const;

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/companies", label: "Companies", icon: Building2 },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: ClipboardList },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, role } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = role === "admin" ? adminNav : studentNav;

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", search: { tab: "login" }, replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-sidebar p-4 lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white shadow">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-bold">Career<span className="text-brand-gradient">Connect</span></span>
        </Link>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {items.map((it) => {
            const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-brand-gradient text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground")
                }
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 rounded-xl border border-border/40 bg-card/40 p-3">
          <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
          <div className="mt-1 text-xs font-semibold capitalize text-brand-gradient">{role ?? "student"}</div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border/40 px-4 lg:px-8">
          <div className="text-sm font-medium text-muted-foreground">
            {items.find((i) => pathname === i.to || (i.to !== "/admin" && pathname.startsWith(i.to)))?.label ?? "Dashboard"}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="mr-1.5 h-4 w-4" /> Sign out</Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}