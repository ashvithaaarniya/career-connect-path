import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, GraduationCap } from "lucide-react";

export function Header() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-lg">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Career<span className="text-brand-gradient">Connect</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#recruiters" className="hover:text-foreground">Recruiters</a>
          <a href="#testimonials" className="hover:text-foreground">Testimonials</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/auth" search={{ tab: "login" }}>Login</Link>
          </Button>
          <Button asChild className="bg-brand-gradient text-white hover:opacity-95 border-0">
            <Link to="/auth" search={{ tab: "signup" }}>Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}