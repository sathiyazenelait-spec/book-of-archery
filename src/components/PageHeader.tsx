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
    <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 border-b border-border/60 overflow-hidden bg-background">
      {/* Dynamic Background Image */}
      {resolvedBgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={resolvedBgImage}
            alt=""
            className="w-full h-full object-cover opacity-[0.12] dark:opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>
      )}
      
      {/* Radial Glow Overlay */}
      <div className="absolute inset-0 opacity-40 z-0" style={{ background: "var(--gradient-radial-gold)" }} />
      
      <div className="container relative z-10">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="h-px w-10 bg-primary" />
          <span className="text-xs uppercase tracking-[0.32em] text-primary">{eyebrow}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.02] max-w-4xl animate-fade-in" style={{ animationDelay: "100ms" }}>
          {title}
        </h1>
        {description && (
          <p className="mt-8 max-w-4xl text-lg text-muted-foreground leading-relaxed animate-fade-in text-justify" style={{ animationDelay: "200ms" }}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
