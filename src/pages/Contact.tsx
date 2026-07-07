import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { saveContactApi } from "@/data/records";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Message too short").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setRevealed(true);
        } else {
          setRevealed(false);
        }
      });
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }

    const success = await saveContactApi(form);
    if (success) {
      toast.success("Message sent. We'll respond within 48 hours.");
      setForm({ name: "", email: "", message: "" });
    } else {
      toast.error("Failed to send message. Please check server connection.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Reach the <em className="text-gradient-gold not-italic">registry.</em></>}
        description="Whether you are actively preparing your first official application, appealing a certification decision, or simply curious about our global verification standards — our international adjudication office is here to guide you. Our team of certified expert coordinators is dedicated to answering your logistics, safety, and evidence requirements. We aim to review and respond to all inquiries within 48 hours, helping you take the next step toward archery history."
      />

      <section ref={sectionRef} className="container py-10 md:py-20 grid lg:grid-cols-5 gap-12 overflow-hidden">
        <div
          className={cn(
            "lg:col-span-2 p-8 space-y-8 rounded-xl border shadow-md transition-all duration-500 reveal-card reveal-left",
            "bg-gradient-to-br from-orange-50 to-amber-100/90 border-amber-200/70 shadow-amber-500/5",
            "dark:bg-gradient-to-br dark:from-amber-950/30 dark:to-amber-900/10 dark:border-amber-900/40 dark:shadow-none",
            revealed && "revealed"
          )}
        >
          <Info
            icon={MapPin}
            label="Headquarters"
            value={"KOORMAI ELAKU PVT LTD\nNO 45 BALAJI NAGAR KOLLUMEDU ROAD\nVELLANUR CHENNAI 62"}
          />
          <Info icon={Mail} label="Email" value="records@abwr.org" />
          <Info
            icon={Phone}
            label="Telephone"
            value={"8668054120, 9840754120, 7305054120"}
          />

          <div className="border border-amber-200/50 dark:border-amber-800/30 bg-background/50 dark:bg-card/50 p-6 rounded-lg">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 font-semibold">Office Hours</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Monday – Saturday<br />09:30 – 18:30 IST<br /><br />
              Field adjudicators operate independently across all global time zones.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className={cn(
            "lg:col-span-3 relative border border-border/60 p-10 reveal-card reveal-right overflow-hidden rounded-lg",
            revealed && "revealed"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Form Background Image and Tint Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.theconversation.com/files/13526/original/c4xgctyd-1343370892.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip"
              alt=""
              className="w-full h-full object-cover opacity-70 dark:opacity-40 blur-[2px] scale-105 hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/60 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="font-display text-3xl mb-2 text-black dark:text-white">Send us a message</h2>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.25em] text-black dark:text-slate-200 font-bold">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="bg-white/80 dark:bg-slate-900/80 text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/50 border-black/30 dark:border-white/20 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.25em] text-black dark:text-slate-200 font-bold">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="bg-white/80 dark:bg-slate-900/80 text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/50 border-black/30 dark:border-white/20 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.25em] text-black dark:text-slate-200 font-bold">Message</Label>
              <Textarea
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                className="bg-white/80 dark:bg-slate-900/80 text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/50 border-black/30 dark:border-white/20 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
              />
            </div>
            <Button type="submit" variant="hero" size="lg">Send Message</Button>
          </div>
        </form>
      </section>
    </>
  );
};

const Info = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex gap-5">
    <div className="w-11 h-11 border border-primary/40 flex items-center justify-center text-primary shrink-0">
      <Icon size={18} />
    </div>
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary mb-1.5">{label}</div>
      <div className="text-sm whitespace-pre-line text-foreground/90 leading-relaxed">{value}</div>
    </div>
  </div>
);

export default Contact;
