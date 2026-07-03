import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { ShieldCheck, Globe2, Trophy, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const values = [
  { icon: ShieldCheck, title: "Verified", text: "Every record is reviewed by three independent ABWR adjudicators." },
  { icon: Globe2, title: "Global", text: "Active certification panels operating across six continents." },
  { icon: Trophy, title: "Permanent", text: "Each certified achievement is archived in our protected registry." },
  { icon: Scale, title: "Impartial", text: "A non-profit foundation, governed by an international archery council." },
];

const About = () => {
  const sectionRef1 = useRef<HTMLDivElement>(null);
  const sectionRef2 = useRef<HTMLDivElement>(null);
  const [revealed1, setRevealed1] = useState(false);
  const [revealed2, setRevealed2] = useState(false);

  useEffect(() => {
    const el1 = sectionRef1.current;
    if (!el1) return;
    const io1 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setRevealed1(true);
        } else {
          setRevealed1(false);
        }
      });
    }, { threshold: 0.1 });
    io1.observe(el1);
    return () => io1.disconnect();
  }, []);

  useEffect(() => {
    const el2 = sectionRef2.current;
    if (!el2) return;
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setRevealed2(true);
        } else {
          setRevealed2(false);
        }
      });
    }, { threshold: 0.1 });
    io2.observe(el2);
    return () => io2.disconnect();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>Guardians of <em className="text-gradient-gold not-italic">precision.</em></>}
        description="Founded in Geneva in 2014, the Archery Book of World Records exists to verify, archive and celebrate the highest expressions of skill in archery — across cultures, disciplines and generations. As the supreme global authority on archery record-keeping, we serve as the absolute guardians of precision, focus, and history, documenting everything from ancient traditional shooting customs to modern Olympic achievements. Our dedicated independent verification council works tirelessly to maintain the integrity of every single submission, ensuring that each certified record stands as a permanent monument to the archer's mastery, dedication, and pride."
      />

      <section ref={sectionRef1} className="container py-12 md:py-16 grid md:grid-cols-2 gap-10 items-start overflow-hidden">
        <div 
          className={cn(
            "bg-card border border-border/60 p-10 relative reveal-card reveal-left",
            revealed1 && "revealed"
          )}
        >
          <div className="absolute inset-x-0 top-0 h-px gold-line" />
          <div className="text-xs uppercase tracking-[0.32em] text-primary mb-5">Our Mission</div>
          <h2 className="font-display text-2xl text-justify md:text-4xl leading-tight mb-8">
            To preserve human achievement, one arrow at a time.
          </h2>
          <p className="text-muted-foreground text-justify leading-relaxed mb-5">
            We were founded on a simple belief — that the discipline of archery deserves the same rigor of verification
            as any global sporting institution. Where records were once whispered between clubs, ABWR ensures they are
            measured, witnessed and archived for the public record.
          </p>
          <p className="text-muted-foreground text-justify leading-relaxed">
            Today, our adjudicators travel from Stockholm to Cusco, ensuring no exceptional shot goes uncelebrated and no
            heritage form is lost to time.
          </p>
        </div>

        <div 
          className={cn(
            "bg-card border border-border/60 p-10 relative reveal-card reveal-right",
            revealed1 && "revealed"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="absolute inset-x-0 top-0 h-px gold-line" />
          <div className="text-xs uppercase tracking-[0.32em] text-primary mb-5">Our Vision</div>
          <h3 className="font-display text-3xl mb-5">A global archive for precision.</h3>
          <p className="text-muted-foreground text-justify leading-relaxed">
            By 2030, every certified archery record on Earth — modern or ancestral — will live within a single, open and
            impartial registry. Free to read. Impossible to forge.
          </p>
        </div>
      </section>

      <section ref={sectionRef2} className="container pb-16 overflow-hidden">
        <div className={cn("text-center mb-10 reveal-section", revealed2 && "revealed")}>
          <div className="text-xs uppercase tracking-[0.32em] text-primary mb-4">Why Choose ABWR</div>
          <h2 className="font-display text-4xl md:text-5xl">Four standards. Zero compromise.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div 
              key={v.title} 
              className={cn(
                "border border-border/60 bg-card p-8 hover:border-primary/40 transition-colors group",
                "reveal-card",
                i % 2 === 0 ? "reveal-left" : "reveal-right",
                revealed2 && "revealed"
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <v.icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={32} />
              <div className="font-display text-2xl mb-3">{v.title}</div>
              <p className="text-sm text-muted-foreground text-justify leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
