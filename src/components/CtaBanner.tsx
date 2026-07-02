import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-archer.jpg";

const CtaBanner = () => (
  <section className="relative py-32 overflow-hidden">
    <img src={heroImg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
    <div className="container relative text-center max-w-3xl">
      <h2 className="font-display text-5xl md:text-7xl leading-[1.02] mb-7">
        Your name belongs in the <em className="text-gradient-gold not-italic">registry.</em>
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto mb-10">
        Submit your attempt and join archers from 96 countries who have already been certified by ABWR.
      </p>
      <Button asChild variant="hero" size="xl">
        <Link to="/apply">Begin Application</Link>
      </Button>
    </div>
  </section>
);

export default CtaBanner;
