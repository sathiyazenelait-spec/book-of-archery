import { useEffect, useRef, useState } from "react";
import { getStatsApi, getStoredStats, HomepageStat } from "@/data/records";

function useCountUp(end: number, start = 0, duration = 1600) {
  const [n, setN] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.floor(start + (end - start) * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, start, duration]);

  return { ref, n };
}

const StatItem = ({ value, suffix, label }: HomepageStat) => {
  const { ref, n } = useCountUp(value);
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <div className="font-sans font-bold text-5xl md:text-6xl text-primary leading-none tracking-tight">
        <span ref={ref}>{n.toLocaleString()}</span>
        <span className="text-primary/70 text-3xl ml-1 font-sans font-semibold">{suffix}</span>
      </div>
      <div className="mt-3.5 text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium">{label}</div>
    </div>
  );
};

const Stats = () => {
  const [statsList, setStatsList] = useState<HomepageStat[]>([]);

  useEffect(() => {
    // Initial load from cache
    setStatsList(getStoredStats());
    
    // Fetch fresh stats from API
    const loadStats = async () => {
      const fresh = await getStatsApi();
      setStatsList(fresh);
    };
    loadStats();
  }, []);

  if (statsList.length === 0) return null;

  return (
    <section className="relative py-24 border-y border-border/60 bg-card">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-12">
        {statsList.map((s) => (
          <StatItem key={`${s.id}-${s.label}`} {...s} />
        ))}
      </div>
    </section>
  );
};

export default Stats;
