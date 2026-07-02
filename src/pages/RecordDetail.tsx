import { Link, useParams } from "react-router-dom";
import { getRecordByIdApi, RecordItem } from "@/data/records";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Share2, Trophy, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const RecordDetail = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<RecordItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const found = await getRecordByIdApi(id);
        if (found) {
          setRecord(found);
        }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container pt-40 pb-32 text-center text-muted-foreground">
        Loading record...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container pt-40 pb-32 text-center">
        <h1 className="font-display text-4xl mb-6">Record not found</h1>
        <Button asChild variant="hero"><Link to="/records">Back to Registry</Link></Button>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: record.title, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <article className="pt-32">
      <div className="container">
        <Link to="/records" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft size={14} /> All Records
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] overflow-hidden border border-border/60 bg-card mb-4">
              <img
                src={record.gallery[active]}
                alt={record.title}
                width={1024}
                height={768}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {record.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-[4/3] overflow-hidden border transition-all ${active === i ? "border-primary" : "border-border/60 hover:border-foreground/40 opacity-70 hover:opacity-100"}`}
                >
                  <img src={g} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary px-3 py-1 border border-primary/40">{record.category}</span>
              <span className="text-xs text-muted-foreground tracking-wider">{record.id}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">{record.title}</h1>

            <div className="flex items-baseline gap-3 py-6 border-y border-border/60 mb-8">
              <Trophy className="text-primary" size={20} />
              <span className="font-display text-3xl text-gradient-gold">{record.metric}</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{record.description}</p>

            <dl className="space-y-4 mb-10 text-sm">
              <div className="flex items-center gap-3">
                <User size={14} className="text-primary" />
                <dt className="text-muted-foreground w-28 uppercase tracking-wider text-xs">Archer</dt>
                <dd className="font-medium">{record.participant}</dd>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-primary" />
                <dt className="text-muted-foreground w-28 uppercase tracking-wider text-xs">Location</dt>
                <dd>{record.location}</dd>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-primary" />
                <dt className="text-muted-foreground w-28 uppercase tracking-wider text-xs">Certified</dt>
                <dd>{record.date}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg"><Link to="/apply">Challenge this Record</Link></Button>
              <Button onClick={handleShare} variant="heroOutline" size="lg">
                <Share2 size={16} /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecordDetail;
