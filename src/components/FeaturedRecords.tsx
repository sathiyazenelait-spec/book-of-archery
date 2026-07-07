import { Link } from "react-router-dom";
import { getStoredRecords, RecordItem } from "@/data/records";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FeaturedRecords = () => {
  const [featured, setFeatured] = useState<RecordItem[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setFeatured(getStoredRecords().slice(0, 3));
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
  }, []);

  return (
    <section ref={sectionRef} className="container py-10 md:py-20">
      <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal-section", revealed && "revealed")}>
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.32em] text-primary">Featured</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl max-w-2xl leading-[1.05]">
            Records that redefined what an arrow can do.
          </h2>
        </div>
        <Button asChild variant="link" className="text-primary text-sm uppercase tracking-[0.2em] self-start md:self-auto">
          <Link to="/records">All Records <ArrowUpRight className="ml-1" /></Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {featured.map((r, i) => (
          <Link
            key={r.id}
            to={`/records/${r.id}`}
            className={cn(
              "group relative overflow-hidden rounded-sm bg-card border border-border/60 hover:border-primary/50 transition-all duration-500",
              "reveal-card",
              i === 0 ? "reveal-left" : i === 2 ? "reveal-right" : "reveal-center",
              revealed && "revealed"
            )}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={r.image}
                alt={r.title}
                loading="lazy"
                width={1024}
                height={1280}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              
              {/* Category Badge overlay */}
              <div className={cn(
                "absolute top-4 left-4 px-3 py-1 text-[10px] uppercase tracking-[0.25em] transition-all duration-300 font-bold z-20",
                "bg-[#080c1f] text-white group-hover:bg-[#080c1f] group-hover:text-[#d4af37]",
                "dark:bg-[#2a241c] dark:text-black dark:group-hover:bg-[#e2a857] dark:group-hover:text-white"
              )}>
                {r.category}
              </div>

              {/* Arrow button overlay */}
              <div className={cn(
                "absolute top-4 right-4 w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 bg-background/40 backdrop-blur-sm group-hover:rotate-45 z-20",
                "group-hover:bg-[#080c1f] group-hover:text-[#d4af37] group-hover:border-[#080c1f]",
                "dark:group-hover:bg-[#e2a857] dark:group-hover:text-white dark:group-hover:border-[#e2a857]"
              )}>
                <ArrowUpRight size={14} />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7">
              <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-[0.25em]">
                <span className="text-primary">{r.category}</span>
                <span className="text-muted-foreground">{r.id}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl leading-tight mb-2 group-hover:text-primary transition-colors">
                {r.title}
              </h3>
              <div className="text-sm text-muted-foreground">
                {r.participant} · <span className="text-primary/90">{r.metric}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRecords;
