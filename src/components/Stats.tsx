import { useEffect, useRef, useState } from "react";
import { getStatsApi, getStoredStats, HomepageStat } from "@/data/records";
import { cn } from "@/lib/utils";

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

interface StatItemProps extends HomepageStat {
  index: number;
  isVisible: boolean;
}

const StatItem = ({ value, suffix, label, index, isVisible }: StatItemProps) => {
  const { ref, n } = useCountUp(value);
  return (
    <div
      className={cn(
        "stat-card group relative p-6 md:p-8 rounded-xl border bg-white/10 dark:bg-black/30 backdrop-blur-sm overflow-hidden",
        isVisible && "stat-card-animate"
      )}
      style={{
        animationDelay: isVisible ? `${index * 300}ms` : "0ms",
      }}
    >
      <div className="relative z-10 text-center flex flex-col items-center justify-center">
        <div className="font-sans font-bold text-5xl md:text-6xl text-white leading-none tracking-tight">
          <span ref={ref}>{n.toLocaleString()}</span>
          <span className="text-white/70 text-3xl ml-1 font-sans font-semibold">{suffix}</span>
        </div>
        <div className="mt-3.5 text-xs uppercase tracking-[0.25em] text-white/80 font-medium">{label}</div>
      </div>
    </div>
  );
};

const Stats = () => {
  const [statsList, setStatsList] = useState<HomepageStat[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [statsList]);

  if (statsList.length === 0) return null;

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 border-y stats-section-light dark:stats-section-dark"
    >
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
        {statsList.map((s, idx) => (
          <StatItem key={`${s.id}-${s.label}`} {...s} index={idx} isVisible={isVisible} />
        ))}
      </div>
    </section>
  );
};

export default Stats;
