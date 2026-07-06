import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { getTestimonialsApi, getStoredTestimonials, Testimonial } from "@/data/records";
import { cn } from "@/lib/utils";

const Testimonials = () => {
  const [storiesList, setStoriesList] = useState<Testimonial[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Initial cache load
    setStoriesList(getStoredTestimonials());

    // Fetch fresh testimonials from API
    const loadTestimonials = async () => {
      const fresh = await getTestimonialsApi();
      setStoriesList(fresh);
    };
    loadTestimonials();
  }, []);

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
  }, [storiesList]);

  if (storiesList.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative py-16 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-card/50" />
      <div className="absolute inset-x-0 top-0 h-px gold-line" />
      <div className="absolute inset-x-0 bottom-0 h-px gold-line" />
      <div className="container relative">
        <div className={cn("text-center max-w-2xl mx-auto mb-20 reveal-section", revealed && "revealed")}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-primary" />
            <span className="text-xs uppercase tracking-[0.32em] text-primary">Voices</span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl">From those who made history.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {storiesList.map((s, i) => (
            <figure
              key={`${s.id}-${s.name}`}
              className={cn(
                "testimonial-card relative p-9 rounded-xl backdrop-blur-sm",
                "reveal-card",
                i === 0 ? "reveal-left" : i === 2 ? "reveal-right" : "reveal-center",
                revealed && "revealed"
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <Quote className="quote-icon mb-6" size={28} />
              <blockquote className="font-display text-xl text-justify leading-snug mb-8">
                "{s.quote}"
              </blockquote>
              <figcaption>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] title-text mt-1">{s.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
