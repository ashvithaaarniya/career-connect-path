import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Career<span className="text-brand-gradient">Connect</span></span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              The AI-powered placement & career portal helping students launch their careers with confidence.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#recruiters" className="hover:text-foreground">Recruiters</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CareerConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}