import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Briefcase } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-orb pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 opacity-60" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.68_0.22_265)]" />
            AI-powered placement & career portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Launch Your Career with{" "}
            <span className="text-brand-gradient">Confidence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Build a standout profile, get AI resume analysis, discover matched jobs and internships,
            and track every application — all in one beautiful portal trusted by colleges and recruiters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="bg-brand-gradient text-white border-0 glow hover:opacity-95">
              <Link to="/auth" search={{ tab: "signup" }}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth" search={{ tab: "login" }}>Student Login</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/auth" search={{ tab: "admin" }}>Admin Login</Link>
            </Button>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[oklch(0.7_0.17_200)]" /> Verified recruiters</div>
            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-[oklch(0.62_0.22_305)]" /> 500+ active drives</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="glass glow rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Profile Strength</div>
                <div className="mt-1 text-3xl font-bold">92<span className="text-base text-muted-foreground">/100</span></div>
              </div>
              <div className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">Excellent</div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className="h-full bg-brand-gradient"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { k: "Applications", v: "24" },
                { k: "Shortlisted", v: "9" },
                { k: "Interviews", v: "4" },
                { k: "Offers", v: "2" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-border/50 bg-card/60 p-3">
                  <div className="text-xs text-muted-foreground">{s.k}</div>
                  <div className="text-xl font-bold">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-border/50 bg-card/60 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI suggestion</div>
              <p className="mt-1 text-sm">
                Add a System Design project to match 3 more matching roles at Infosys and TCS.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}