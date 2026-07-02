import { Link } from "react-router-dom";
import { getStoredRecords, RecordItem } from "@/data/records";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const FeaturedRecords = () => {
  const [featured, setFeatured] = useState<RecordItem[]>([]);

  useEffect(() => {
    setFeatured(getStoredRecords().slice(0, 3));
  }, []);
  return (
    <section className="container py-28 md:py-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
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
            className="group relative overflow-hidden rounded-sm bg-card border border-border/60 hover:border-primary/50 transition-all duration-500"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={r.image}
                alt={r.title}
                loading="lazy"
                width={1024}
                height={1280}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
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
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-45 bg-background/40 backdrop-blur-sm">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRecords;
