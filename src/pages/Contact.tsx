import { useState } from "react";
import { z } from "zod";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { saveContactApi } from "@/data/records";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Message too short").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { toast.error(r.error.issues[0].message); return; }
    
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
        description="Whether you're applying, appealing or simply curious — our adjudication office responds within 48 hours."
      />

      <section className="container py-20 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Info icon={MapPin} label="Headquarters" value={"14 Laurel Court\nGeneva, Switzerland"} />
          <Info icon={Mail} label="Email" value="records@abwr.org" />
          <Info icon={Phone} label="Telephone" value="+41 22 555 0184" />

          <div className="border border-border/60 bg-card p-8">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Office Hours</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Monday – Friday<br />09:00 – 17:30 CET<br /><br />
              Field adjudicators operate independently across all global time zones.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-3 bg-card border border-border/60 p-10 space-y-6">
          <h2 className="font-display text-3xl mb-2">Send us a message</h2>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Message</Label>
            <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
          </div>
          <Button type="submit" variant="hero" size="lg">Send Message</Button>
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
