import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { getRecordsApi, categories, RecordCategory, RecordItem } from "@/data/records";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Records = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<RecordCategory | "All">("All");
  const [allRecords, setAllRecords] = useState<RecordItem[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getRecordsApi();
      setAllRecords(data);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return allRecords.filter((r) => {
      const matchCat = active === "All" || r.category === active;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.participant.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [allRecords, query, active]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (allRecords.length > 0) {
      setRevealed(true);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setRevealed(true);
        }
      });
    }, { threshold: 0.02 });

    io.observe(el);
    return () => io.disconnect();
  }, [allRecords]);

  return (
    <>
      <PageHeader
        eyebrow="The Registry"
        title={<>All <em className="text-gradient-gold not-italic">certified</em> records.</>}
        description="Explore the definitive chronicle of human potential and precision. Browse every historic milestone, record-breaking attempt, and extraordinary feat certified by the global ABWR adjudication panels. Use the filter options to narrow down by specific archery discipline or search directly by archer name, record title, or attempt location to discover the legendary achievements that continue to shape the sport of archery across generations."
      />

      <div className="relative overflow-hidden w-full bg-background">
        {/* Animated Background Mesh Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/2.5 blur-3xl pointer-events-none animate-drift-one" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 dark:bg-[#080c1f]/5 blur-3xl pointer-events-none animate-drift-two" />
        
        {/* Animated Floating Dotted Grid for 3D/Space depth */}
        <div 
          className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#d4af37 1px, transparent 1px)",
            backgroundSize: "2.5rem 2.5rem",
          }}
        />

        <section ref={sectionRef} className="container relative z-10 py-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search archer, record or location"
                className="pl-11 h-12 bg-card border-border/60 focus-visible:ring-primary/40"
              />
            </div>
            <div className="w-full md:w-72">
              <Select value={active} onValueChange={(val) => setActive(val as RecordCategory | "All")}>
                <SelectTrigger className="h-12 bg-card border-border/60 focus:ring-primary/40 text-muted-foreground">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-md border-border/60">
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">No records match your search.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((r, idx) => (
                <Link
                  key={r.id}
                  to={`/records/${r.id}`}
                  className={cn(
                    "group border border-[#d4af37]/20 dark:border-border/60 bg-[#080c1f] dark:bg-card hover:border-[#d4af37]/60 dark:hover:border-primary/40 hover:shadow-2xl transition-all duration-500 overflow-hidden",
                    "reveal-card",
                    idx % 3 === 0 ? "reveal-left" : idx % 3 === 2 ? "reveal-right" : "reveal-center",
                    revealed && "revealed"
                  )}
                  style={{ transitionDelay: `${(idx % 3) * 150}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={cn(
                      "absolute top-4 left-4 px-3 py-1 text-[10px] uppercase tracking-[0.25em] transition-all duration-300 font-bold z-20",
                      "bg-[#080c1f] text-white group-hover:bg-[#080c1f] group-hover:text-[#d4af37]",
                      "dark:bg-[#2a241c] dark:text-black dark:group-hover:bg-[#e2a857] dark:group-hover:text-white"
                    )}>
                      {r.category}
                    </div>
                    <div className={cn(
                      "absolute top-4 right-4 w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 bg-background/40 backdrop-blur-sm group-hover:rotate-45 z-20",
                      "group-hover:bg-[#080c1f] group-hover:text-[#d4af37] group-hover:border-[#080c1f]",
                      "dark:group-hover:bg-[#e2a857] dark:group-hover:text-white dark:group-hover:border-[#e2a857]"
                    )}>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                  <div className="p-7">
                    <div className="text-xs text-slate-400 dark:text-muted-foreground mb-2 tracking-wider">{r.id}</div>
                    <h3 className="font-display text-2xl leading-tight mb-3 text-white dark:text-foreground group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-muted-foreground mb-5 line-clamp-2">{r.shortDescription}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-muted-foreground border-t border-white/10 dark:border-border/60 pt-4">
                      <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {r.location.split(",")[0]}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {r.date.split(",")[0]}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Records;
