import PageHeader from "@/components/PageHeader";
import { posts } from "@/data/posts";
import { ArrowUpRight } from "lucide-react";

const Blog = () => (
  <>
    <PageHeader
      eyebrow="Journal"
      title={<>Notes from the <em className="text-gradient-gold not-italic">field.</em></>}
      description="Announcements, judging standards, and stories from the global ABWR community."
    />
    <section className="container py-10 md:py-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((p) => (
          <article key={p.slug} className="group border border-border/60 bg-card p-8 hover:border-primary/40 transition-colors cursor-pointer">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] mb-6">
              <span className="text-primary">{p.category}</span>
              <span className="text-muted-foreground">{p.readTime}</span>
            </div>
            <h2 className="font-display text-2xl leading-tight mb-4 group-hover:text-primary transition-colors">{p.title}</h2>
            <p className="text-sm text-muted-foreground mb-8">{p.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-4">
              <span>{p.date}</span>
              <ArrowUpRight size={14} className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
);

export default Blog;
