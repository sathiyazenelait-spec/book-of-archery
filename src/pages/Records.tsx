import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { getRecordsApi, categories, RecordCategory, RecordItem } from "@/data/records";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Records = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<RecordCategory | "All">("All");
  const [allRecords, setAllRecords] = useState<RecordItem[]>([]);

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

  return (
    <>
      <PageHeader
        eyebrow="The Registry"
        title={<>All <em className="text-gradient-gold not-italic">certified</em> records.</>}
        description="Browse every achievement archived by the ABWR adjudication panels. Filter by discipline or search by archer, title or location."
      />

      <section className="container py-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search archer, record or location"
              className="pl-11 h-12 bg-card border-border/60 focus-visible:ring-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  "px-4 py-2 text-xs uppercase tracking-[0.2em] border transition-all",
                  active === c
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">No records match your search.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to={`/records/${r.id}`}
                className="group border border-border/60 bg-card hover:border-primary/40 transition-all duration-500 overflow-hidden"
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
                  <div className="absolute top-4 left-4 px-3 py-1 text-[10px] uppercase tracking-[0.25em] bg-background/80 backdrop-blur-sm text-primary">
                    {r.category}
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 bg-background/40 backdrop-blur-sm group-hover:rotate-45">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
                <div className="p-7">
                  <div className="text-xs text-muted-foreground mb-2 tracking-wider">{r.id}</div>
                  <h3 className="font-display text-2xl leading-tight mb-3 group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{r.shortDescription}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-4">
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {r.location.split(",")[0]}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {r.date.split(",")[0]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Records;
