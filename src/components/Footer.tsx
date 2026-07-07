import { Link } from "react-router-dom";
import { Instagram, Youtube, Twitter } from "lucide-react";
const logo = "/logo.jpeg";

const Footer = () => (
  <footer className="relative mt-16 md:mt-32 border-t border-border/60 bg-background">
    <div className="absolute inset-x-0 top-0 h-px gold-line" />
    <div className="container py-10 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-5 max-w-md">
        <div className="flex items-center gap-3.5 mb-5">
          <img src={logo} alt="" width={44} height={44} className="h-11 w-11 shrink-0" />
          <div className="flex flex-col leading-none">
            <div className="font-display text-xl md:text-2xl font-bold uppercase tracking-wider text-foreground">
              Archery Book of World Records
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-primary font-medium mt-1">
              Managed by a unit of KOORMAI ELAKU Pvt Ltd
            </div>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          The global authority for verified archery achievement. Founded to preserve precision,
          discipline and human possibility — one arrow at a time.
        </p>
      </div>

      <div className="md:col-span-2">
        <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Explore</h4>
        <ul className="space-y-3 text-sm text-foreground/80">
          <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
          <li><Link to="/apply" className="hover:text-primary transition-colors">Apply for Record</Link></li>
          <li><Link to="/downloads" className="hover:text-primary transition-colors">Downloads</Link></li>
          <li><Link to="/records" className="hover:text-primary transition-colors">Record Gallery</Link></li>
          <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
        </ul>
      </div>

      <div className="md:col-span-3">
        <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Contact</h4>
        <ul className="space-y-3 text-sm text-foreground/80">
          <li className="font-semibold text-foreground">KOORMAI ELAKU PVT LTD</li>
          <li>NO 45 BALAJI NAGAR KOLLUMEDU ROAD,<br />VELLANUR, CHENNAI 62</li>
          <li>records@abwr.org</li>
          <li className="pt-1">
            <span className="font-medium text-foreground block mb-1">Phone Numbers:</span>
            <div className="space-y-0.5 font-mono text-xs">
              <a href="tel:8668054120" className="hover:text-primary transition-colors block">8668054120</a>
              <a href="tel:9840754120" className="hover:text-primary transition-colors block">9840754120</a>
              <a href="tel:7305054120" className="hover:text-primary transition-colors block">7305054120</a>
            </div>
          </li>
        </ul>
        <div className="flex gap-4 mt-6 text-foreground/60">
          <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram size={18} /></a>
          <a href="#" aria-label="YouTube" className="hover:text-primary transition-colors"><Youtube size={18} /></a>
          <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter size={18} /></a>
        </div>
      </div>
      <div className="md:col-span-2">
        <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Developed By</h4>
        <div>
          <img src="/developed_logo.jpg" alt="" height={70} width={120} />
        </div>
      </div>
    </div>
    <div className="border-t border-border/40  bg-gold">
      <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} Archery Book of World Records. All rights reserved.</div>
        <div className="tracking-[0.2em] uppercase">Veritas · Disciplina · Excellentia</div>
      </div>
    </div>
  </footer>
);

export default Footer;
