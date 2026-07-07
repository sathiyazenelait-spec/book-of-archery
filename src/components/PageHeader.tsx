import React from "react";

const getHeaderBgImage = (eyebrow: string) => {
  const eb = eyebrow.toLowerCase();
  if (eb.includes("about") || eb.includes("mission") || eb.includes("history")) {
    return "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1920&auto=format&fit=crop"; // close archery bow focus
  }
  if (eb.includes("registry") || eb.includes("gallery") || eb.includes("record")) {
    return "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1920&auto=format&fit=crop"; // archery targets range
  }
  if (eb.includes("download") || eb.includes("document") || eb.includes("form") || eb.includes("downloads")) {
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920&auto=format&fit=crop"; // workspace / checklist
  }
  if (eb.includes("contact")) {
    return "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1920&auto=format&fit=crop"; // desk/letters/mail
  }
  if (eb.includes("portal") || eb.includes("apply") || eb.includes("claim") || eb.includes("submission")) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"; // archer range portal
  }
  return "";
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
    <section className="relative pt-44 pb-12 md:pt-52 md:pb-16 border-b border-border/60 overflow-hidden bg-background">
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

        {/* Archery Target & Shooting Arrow Animation */}
        {description && eyebrow.toLowerCase().includes("about") && (
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
        )}
      </div>
    </section>
  );
};

export default PageHeader;
