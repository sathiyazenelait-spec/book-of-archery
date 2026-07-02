import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { getTestimonialsApi, getStoredTestimonials, Testimonial } from "@/data/records";

const Testimonials = () => {
  const [storiesList, setStoriesList] = useState<Testimonial[]>([]);

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

  if (storiesList.length === 0) return null;

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-card/50" />
      <div className="absolute inset-x-0 top-0 h-px gold-line" />
      <div className="absolute inset-x-0 bottom-0 h-px gold-line" />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-20">
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
              className="relative p-9 border border-border/60 bg-background/40 backdrop-blur-sm hover:border-primary/40 transition-colors duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Quote className="text-primary/40 mb-6" size={28} />
              <blockquote className="font-display text-xl text-justify leading-snug mb-8 text-foreground/95">
                "{s.quote}"
              </blockquote>
              <figcaption>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
