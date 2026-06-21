import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 1.6, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, to, mv]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Students Placed", value: 12500, suffix: "+" },
  { label: "Companies Hiring", value: 480, suffix: "+" },
  { label: "Applications Submitted", value: 96000, suffix: "+" },
  { label: "Placement Success Rate", value: 94, suffix: "%" },
];

export function Stats() {
  return (
    <section className="border-y border-border/40 bg-background/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-8 text-center">
            <div className="text-4xl font-extrabold sm:text-5xl">
              <span className="text-brand-gradient">
                <Counter to={s.value} suffix={s.suffix} />
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}