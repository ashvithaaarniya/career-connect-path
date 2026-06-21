import { Brain, FileText, Briefcase, BarChart3, Bell, GraduationCap, Trophy, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Brain, title: "AI Career Coach", desc: "Personalized career advice, skill-gap analysis, and a 4-week learning plan." },
  { icon: FileText, title: "AI Resume Analyzer", desc: "Instant resume score out of 100 with actionable improvements." },
  { icon: Briefcase, title: "Smart Job Matching", desc: "Recommendations tuned to your skills, CGPA, and goals." },
  { icon: BarChart3, title: "Placement Analytics", desc: "Department-wise placement breakdowns and monthly trends." },
  { icon: Bell, title: "Real-time Alerts", desc: "Stay updated on shortlists, interview schedules, and offers." },
  { icon: GraduationCap, title: "Profile Builder", desc: "Showcase skills, projects, certifications and academics." },
  { icon: Trophy, title: "Mock Tests & Prep", desc: "Aptitude practice and interview question bank." },
  { icon: Building2, title: "Verified Companies", desc: "Hand-vetted recruiters and authentic hiring drives." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-sm font-semibold uppercase tracking-wider text-brand-gradient">Everything you need</div>
        <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">A complete placement platform</h2>
        <p className="mt-4 text-muted-foreground">From profile to offer letter, CareerConnect handles every step with AI at your side.</p>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient text-white shadow-md">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}