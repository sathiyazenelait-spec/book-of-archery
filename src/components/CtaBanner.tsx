import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-archer.jpg";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TypingRegistry = () => {
  const [text, setText] = useState("");
  const fullText = "registry";
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTypingSpeed(1800); // Pause on complete word
        setIsDeleting(true);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setTypingSpeed(300); // Pause before next type
      } else {
        setTypingSpeed(isDeleting ? 80 : 150);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, typingSpeed]);

  return (
    <span className="inline-block animate-float-slow text-gradient-gold not-italic">
      {text || "\u00A0"}
      <span className="inline-block w-[3px] h-[0.75em] bg-primary ml-1.5 animate-pulse align-middle" />
    </span>
  );
};

const CtaBanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setRevealed(true);
        } else {
          setRevealed(false);
        }
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={cn("relative py-16 overflow-hidden reveal-section", revealed && "revealed")}>
      <img src={heroImg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="container relative text-center max-w-7xl">
        <h2 className="font-display text-5xl md:text-7xl leading-[1.02] mb-7">
          Your name belongs in the <TypingRegistry />.
        </h2>
        <p className="text-muted-foreground text-justify max-w-6xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
          Take your place in history by submitting your official record attempt to the Archery Book of World Records. Whether you are a traditional archer, a compound shooter, or an Olympic recurve competitor, your extraordinary achievements deserve global recognition. By joining our registry, you connect with a prestigious community of passionate archers spanning over ninety-six countries, each certified by the rigid standards of ABWR. Our platform is dedicated to documenting, validating, and celebrating the pinnacle of precision, focus, and endurance in archery sports worldwide. From individual target feats and long-range accuracy milestones to massive organizational synchronized shooting events, every certified record represents a triumph of dedication and skill. Begin your application today, submit your verified scoresheets and video evidence, and let the world celebrate your unwavering dedication. Your target, your record, and your pride belong on the global stage. Step up to the line, draw your bow, and secure your legendary legacy.
        </p>
        <Button asChild variant="hero" size="xl">
          <Link to="/apply">Begin Application</Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaBanner;
