import { Star } from "lucide-react";

const items = [
  {
    name: "Ananya Sharma",
    role: "Placed at Infosys",
    text: "The AI resume analyzer pushed my score from 62 to 91. Got shortlisted in 3 days!",
  },
  {
    name: "Rahul Verma",
    role: "Placed at TCS Digital",
    text: "Job recommendations were spot on. The interview prep questions felt like the real thing.",
  },
  {
    name: "Dr. Priya Iyer",
    role: "TPO, MIT College",
    text: "Department-wise analytics and bulk drive management have transformed how we run placements.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Loved by students & TPOs</h2>
        <p className="mt-4 text-muted-foreground">Real stories from our growing community.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="glass rounded-2xl p-6">
            <div className="flex gap-0.5 text-[oklch(0.78_0.18_70)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                {t.name.split(" ").map((p) => p[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}