import heroImg from "@/assets/hero-archer.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// A high-quality stock archery video. Replace VIDEO_URL with your own MP4 anytime.
const VIDEO_URL =
  "https://cdn.coverr.co/videos/coverr-archer-aiming-at-target-4634/1080p.mp4";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden ">
      {/* Poster image as instant LCP, video fades in over it */}
      {/* <img
        src={heroImg}
        alt="Archer drawing a recurve bow at golden hour"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      /> */}
      {/* <video
        className="absolute inset-0 w-full h-full object-cover animate-fade-in-slow"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={heroImg}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video> */}

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-radial-gold)" }} />

      <div className="relative z-10 h-full container flex flex-col justify-end pb-24 md:pb-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-7 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="h-px w-10 bg-primary" />

          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Achieve the <em className="text-gradient-gold not-italic">Impossible.</em>
            <br />
            Set a Record.
          </h1>

          <p className="text-base md:text-lg text-foreground/80 max-w-xl mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "350ms" }}>
            The Archery Book of World Records is the global authority for verified
            archery achievement — preserving precision, courage and discipline since 2014.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <Button asChild variant="hero" size="xl">
              <Link to="/apply">
                Apply for a Record <ArrowRight className="ml-1" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/records">View Records</Link>
            </Button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 w-[400px] h-[700px] hidden md:block">
          <img src="/archery_image.png" alt="" className="w-full h-full object-contain" />
        </div>


      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-foreground/60">
        <span>Scroll</span>

      </div>
    </section>
  );
};

export default Hero;
