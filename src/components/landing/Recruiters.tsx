const names = ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Capgemini", "IBM"];

export function Recruiters() {
  return (
    <section id="recruiters" className="border-y border-border/40 bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted by leading recruiters
        </p>
        <div className="mt-8 grid grid-cols-3 items-center gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {names.map((n) => (
            <div
              key={n}
              className="glass flex h-16 items-center justify-center rounded-xl text-lg font-bold tracking-tight text-foreground/80"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}