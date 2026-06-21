import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is CareerConnect free for students?", a: "Yes, all core features are free for students enrolled at partner colleges." },
  { q: "How does the AI resume analyzer work?", a: "It scans your resume against the target role and gives a 0–100 score with concrete improvements." },
  { q: "Can colleges manage their own drives?", a: "Yes — admins can add companies, schedule drives, shortlist candidates and export reports." },
  { q: "Is my data secure?", a: "We use row-level security with encrypted storage. Resumes are private and only visible to you and admins." },
  { q: "Do recruiters get a separate dashboard?", a: "Recruiters work with the placement office. Admin dashboards expose hiring-drive analytics and applicant pipelines." },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Frequently asked questions</h2>
      </div>
      <Accordion type="single" collapsible className="mt-12">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}