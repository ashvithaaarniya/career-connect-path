import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h2>
          <p className="mt-4 text-muted-foreground">
            Bring CareerConnect to your campus. Our team will set you up with a dedicated admin workspace within 24 hours.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-[oklch(0.68_0.22_265)]" /> hello@careerconnect.app</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-[oklch(0.7_0.17_200)]" /> +91 80 4000 1234</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[oklch(0.62_0.22_305)]" /> Bengaluru, India</div>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Thanks! We'll be in touch soon."); }}
          className="glass rounded-2xl p-6"
        >
          <div className="grid gap-4">
            <div className="grid gap-2"><label className="text-sm font-medium">Full name</label><Input required placeholder="Jane Doe" /></div>
            <div className="grid gap-2"><label className="text-sm font-medium">Email</label><Input required type="email" placeholder="jane@college.edu" /></div>
            <div className="grid gap-2"><label className="text-sm font-medium">Message</label><Textarea required rows={4} placeholder="Tell us about your placement needs..." /></div>
            <Button type="submit" className="bg-brand-gradient text-white border-0">Send message</Button>
          </div>
        </form>
      </div>
    </section>
  );
}