import React from "react";
import { Trophy, FileText, Send } from "lucide-react";

const getHeaderBgImage = (eyebrow: string) => {
  const eb = eyebrow.toLowerCase();
  if (eb.includes("about") || eb.includes("mission") || eb.includes("history")) {
    return "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1920&auto=format&fit=crop"; // close archery bow focus
  }
  if (eb.includes("registry") || eb.includes("gallery") || eb.includes("record")) {
    return "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1920&auto=format&fit=crop"; // archery targets range
  }
  if (eb.includes("download") || eb.includes("document") || eb.includes("form") || eb.includes("downloads") || eb.includes("resources") || eb.includes("guidelines") || eb.includes("journal") || eb.includes("rules") || eb.includes("procedure")) {
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920&auto=format&fit=crop"; // workspace / checklist
  }
  if (eb.includes("contact")) {
    return "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1920&auto=format&fit=crop"; // desk/letters/mail
  }
  if (eb.includes("portal") || eb.includes("apply") || eb.includes("claim") || eb.includes("submission") || eb.includes("dashboard") || eb.includes("view") || eb.includes("access") || eb.includes("restriction") || eb.includes("denied") || eb.includes("member")) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"; // archer range portal
  }
  return "";
};

const HeaderAnimation = ({ eyebrow }: { eyebrow: string }) => {
  const eb = eyebrow.toLowerCase();

  if (eb.includes("about") || eb.includes("mission") || eb.includes("history")) {
    // 1. Archery Target & Shooting Arrow Animation
    return (
      <div className="relative w-64 h-48 flex items-center justify-center shrink-0 self-center md:self-end md:mb-4 bg-card/45 backdrop-blur-[2px] border border-border/30 rounded-2xl p-6 shadow-sm overflow-visible animate-fade-in" style={{ animationDelay: "300ms" }}>
        {/* Target concentric circles */}
        <div className="w-36 h-36 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center shadow-inner relative z-10">
          <div className="w-28 h-28 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-red-700 dark:bg-red-800 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Animated Arrow */}
        <div className="absolute left-[-160px] top-1/2 -translate-y-1/2 w-32 h-1.5 bg-slate-800 dark:bg-slate-200 flex items-center justify-end z-20 animate-arrow-shoot pointer-events-none">
          {/* Feathers */}
          <div className="absolute left-0 w-5 h-3 bg-red-500 dark:bg-red-600 rounded-sm skew-x-12" />
          <div className="absolute left-1.5 w-5 h-3 bg-red-500 dark:bg-red-600 rounded-sm -skew-x-12" />
          {/* Arrowhead */}
          <div className="w-2.5 h-2.5 bg-slate-800 dark:bg-slate-200 rotate-45 transform origin-center" />
        </div>
      </div>
    );
  }

  if (eb.includes("registry") || eb.includes("gallery") || eb.includes("record")) {
    // 2. Trophy & Shining Stars Animation
    return (
      <div className="relative w-64 h-48 flex items-center justify-center shrink-0 self-center md:self-end md:mb-4 bg-card/45 backdrop-blur-[2px] border border-border/30 rounded-2xl p-6 shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="relative flex flex-col items-center justify-center z-10">
          {/* Trophy Icon */}
          <div className="relative p-5 bg-gradient-gold rounded-full text-primary-foreground shadow-lg animate-trophy-bounce">
            <Trophy size={48} className="drop-shadow-md" />
            {/* Sunburst glow behind */}
            <div className="absolute inset-0 bg-white/20 rounded-full filter blur-md animate-pulse pointer-events-none" />
          </div>

          {/* Sparkles / Stars */}
          <div className="absolute top-[-10px] left-[-10px] w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute bottom-[10px] right-[-10px] w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-[20px] right-[-20px] w-2 h-2 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: "1s" }} />

          <div className="text-[10px] uppercase font-mono tracking-widest text-primary mt-4 font-bold animate-pulse">
            ABWR Certified
          </div>
        </div>
      </div>
    );
  }

  if (eb.includes("download") || eb.includes("document") || eb.includes("form") || eb.includes("downloads") || eb.includes("rules") || eb.includes("procedure") || eb.includes("resources") || eb.includes("guidelines") || eb.includes("journal")) {
    // 3. Document slide & shoot into drawer (like basketball shoot into hoop)
    return (
      <div className="relative w-64 h-48 flex items-center justify-center shrink-0 self-center md:self-end md:mb-4 bg-card/45 backdrop-blur-[2px] border border-border/30 rounded-2xl p-6 shadow-sm overflow-visible animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="relative w-full h-full flex flex-col justify-between items-center">
          {/* Hoop / Tray (The Goal) */}
          <div className="absolute bottom-2 w-32 h-10 border-2 border-primary/60 border-t-0 rounded-b-xl flex items-center justify-center bg-card/70 z-10">
            <div className="w-24 h-1 bg-primary/30 rounded" />
            {/* Net pattern in background */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:8px_8px]" />
          </div>

          {/* Basketball Document shooting into the goal */}
          <div className="absolute left-[-20px] top-0 p-3 bg-background border border-border/80 rounded-lg shadow-md animate-doc-shoot z-20">
            <FileText size={24} className="text-primary" />
          </div>

          {/* Dotted path of the shot */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 30,30 Q 120,-30 120,110" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" className="text-border/40" />
          </svg>

          {/* Goal Rim line */}
          <div className="absolute bottom-11 w-32 h-1 bg-red-500 rounded-full z-30 animate-pulse" />
        </div>
      </div>
    );
  }

  if (eb.includes("contact")) {
    // 4. Paper airplane flying in a loop
    return (
      <div className="relative w-64 h-48 flex items-center justify-center shrink-0 self-center md:self-end md:mb-4 bg-card/45 backdrop-blur-[2px] border border-border/30 rounded-2xl p-6 shadow-sm overflow-visible animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Mailbox or target */}
          <div className="absolute right-4 bottom-4 p-3 bg-muted border border-border/60 rounded-xl flex items-center justify-center text-foreground z-10 animate-mailbox-wiggle">
            <Send size={24} className="text-primary rotate-45" />
          </div>

          {/* Paper airplane looping */}
          <div className="absolute animate-airplane-loop z-20">
            <svg viewBox="0 0 24 24" width="24" height="24" className="text-primary transform -rotate-45 drop-shadow">
              <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </div>

          {/* Dotted Loop Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20,120 C 20,40 100,20 120,60 C 140,100 160,120 180,100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" className="text-border/40" />
          </svg>
        </div>
      </div>
    );
  }

  if (eb.includes("portal") || eb.includes("apply") || eb.includes("claim") || eb.includes("submission") || eb.includes("login") || eb.includes("admin") || eb.includes("dashboard") || eb.includes("view") || eb.includes("access") || eb.includes("restriction") || eb.includes("denied") || eb.includes("member")) {
    // 5. Stamp pressing down on document
    return (
      <div className="relative w-64 h-48 flex items-center justify-center shrink-0 self-center md:self-end md:mb-4 bg-card/45 backdrop-blur-[2px] border border-border/30 rounded-2xl p-6 shadow-sm overflow-visible animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="relative w-40 h-32 bg-background border border-border/80 rounded shadow-inner p-3 flex flex-col justify-between overflow-hidden">
          {/* Lines representing document content */}
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 bg-muted rounded" />
            <div className="h-2 w-1/2 bg-muted rounded" />
            <div className="h-2 w-5/6 bg-muted rounded" />
          </div>

          {/* Gold seal / Stamp imprint */}
          <div className="self-end mr-2 mb-2 w-12 h-12 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-[8px] tracking-tighter uppercase rotate-[-12deg] animate-stamp-imprint">
            APPROVED
          </div>

          {/* Animated Stamp Handle pressing down */}
          <div className="absolute left-[50%] top-[-50px] -translate-x-1/2 w-10 h-16 bg-slate-700 dark:bg-slate-600 rounded-t-full border border-slate-600 flex flex-col items-center justify-end pb-2 shadow z-20 animate-stamp-press">
            <div className="w-8 h-3 bg-slate-800 dark:bg-slate-700 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  // Fallback default animation (spinning target / gold star)
  return (
    <div className="relative w-64 h-48 flex items-center justify-center shrink-0 self-center md:self-end md:mb-4 bg-card/45 backdrop-blur-[2px] border border-border/30 rounded-2xl p-6 shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="w-20 h-20 rounded-full border-4 border-dashed border-primary/40 flex items-center justify-center animate-spin" style={{ animationDuration: "12s" }}>
        <Trophy size={32} className="text-primary animate-pulse" />
      </div>
    </div>
  );
};

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  bgImage?: string;
}

const PageHeader = ({ eyebrow, title, description, bgImage }: PageHeaderProps) => {
  const resolvedBgImage = bgImage || getHeaderBgImage(eyebrow);

  return (
    <section className="relative pt-52 pb-12 md:pt-60 md:pb-16 border-b border-border/60 overflow-hidden bg-background">
      {/* Dynamic Background Image */}
      {resolvedBgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={resolvedBgImage}
            alt=""
            className="w-full h-full object-cover opacity-[0.44] dark:opacity-[0.10]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>
      )}

      {/* Radial Glow Overlay */}
      <div className="absolute inset-0 opacity-40 z-0" style={{ background: "var(--gradient-radial-gold)" }} />

      <div className="container relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12">
        <div className="max-w-4xl flex-1">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.32em] text-primary">{eyebrow}</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] animate-fade-in" style={{ animationDelay: "100ms" }}>
            {title}
          </h1>
          {description && (
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed animate-fade-in text-justify" style={{ animationDelay: "200ms" }}>
              {description}
            </p>
          )}
        </div>

        {description && <HeaderAnimation eyebrow={eyebrow} />}
      </div>
    </section>
  );
};

export default PageHeader;
