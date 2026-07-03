interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}

const PageHeader = ({ eyebrow, title, description }: PageHeaderProps) => (
  <section className="pt-32 pb-12 md:pt-36 md:pb-16 border-b border-border/60 relative overflow-hidden">
    <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-radial-gold)" }} />
    <div className="container relative">
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <div className="h-px w-10 bg-primary" />
        <span className="text-xs uppercase tracking-[0.32em] text-primary">{eyebrow}</span>
      </div>
      <h1 className="font-display text-5xl md:text-7xl leading-[1.02] max-w-4xl animate-fade-in" style={{ animationDelay: "100ms" }}>
        {title}
      </h1>
      {description && (
        <p className="mt-8 max-w-4xl text-lg text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
          {description}
        </p>
      )}
    </div>
  </section>
);

export default PageHeader;
