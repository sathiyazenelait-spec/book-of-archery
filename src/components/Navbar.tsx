import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Shield, Award, FileText, ClipboardCheck, ShieldCheck, Sun, Moon } from "lucide-react";
const logo = "/logo.jpeg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useTheme } from "@/components/theme-provider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full border border-border/60 hover:border-primary/50 bg-card/40 hover:bg-card/85 text-foreground hover:text-primary transition-all duration-300 focus:outline-none flex items-center justify-center shrink-0"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"apply" | "downloads" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getParsedToken = () => {
    const token = sessionStorage.getItem("abwr_admin_token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const currentUser = getParsedToken();
  const isAdmin = currentUser && currentUser.role === "admin";

  const handleLogout = () => {
    sessionStorage.removeItem("abwr_admin_is_logged_in");
    sessionStorage.removeItem("abwr_admin_token");
    window.location.href = "/";
  };

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
    setIsLoggedIn(sessionStorage.getItem("abwr_admin_is_logged_in") === "true");
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      )}
    >
      {/* Marquee Banner */}
      <div className="w-full h-8 bg-[#d4af37] dark:bg-[#9a3412] flex justify-center items-center overflow-hidden border-b border-border/20">
        <div
          className="w-[92%] sm:w-[85%] md:w-[75%] lg:w-[65%] h-full bg-white dark:bg-[#0f172a] text-[#080c1f] dark:text-white flex items-center px-12"
          style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 24px) 100%, 24px 100%)" }}
        >
          <marquee scrollamount="5" className="py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider font-mono">
            India's Leading World & National Records Registry— An Officially Certified Archery Book of Records, Organized by Koormai Elaku Pvt. Ltd
          </marquee>
        </div>
      </div>

      <div className={cn("container flex items-center justify-between transition-all duration-300", isLoggedIn ? "h-[92px] py-3" : "h-[118px] py-4.5")}>
        <Link to="/" className="flex items-center gap-4 group">
          <img
            src={logo}
            alt="ABWR emblem"
            width={75}
            height={75}
            className={cn(
              "object-contain group-hover:rotate-6 transition-all duration-300 shrink-0",
              isLoggedIn ? "h-[48px] w-[48px] md:h-[55px] md:w-[55px]" : "h-[64px] w-[64px] md:h-[75px] md:w-[75px]"
            )}
          />
          <div className="flex flex-col justify-center leading-none">
            <div className={cn(
              "font-display font-bold tracking-normal uppercase text-foreground transition-all duration-300 w-fit",
              isLoggedIn ? "text-xs sm:text-sm md:text-base lg:text-[15px]" : "text-sm sm:text-base md:text-lg lg:text-[16.5px]"
            )}>
              Archery Book of World Records
            </div>
            <div className={cn(
              "uppercase tracking-[0.12em] text-primary font-medium transition-all duration-300 w-fit",
              isLoggedIn ? "text-[7px] sm:text-[8px] md:text-[8.5px] mt-0.5" : "text-[8px] sm:text-[9px] md:text-[10px] mt-1"
            )}>
              A unit of KOORMAI ELAKU Pvt Ltd
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-3 xl:gap-6 shrink-0 whitespace-nowrap">
          <RouterNavLink
            to="/about"
            className={({ isActive }) =>
              cn(
                "text-xs uppercase tracking-[0.12em] xl:tracking-[0.18em] transition-all duration-300 px-2.5 xl:px-4 py-1.5 rounded-full whitespace-nowrap",
                isActive
                  ? "bg-gradient-gold-real text-[#080c1f] font-bold shadow-md"
                  : "text-foreground/80 hover:text-primary hover:bg-muted/40"
              )
            }
          >
            About us
          </RouterNavLink>

          {/* Dropdown 1: Apply for record */}
          <div
            className="relative py-4"
            onMouseEnter={() => setActiveMenu("apply")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="text-xs uppercase tracking-[0.12em] xl:tracking-[0.18em] text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none select-none whitespace-nowrap">
              Apply for record <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", activeMenu === "apply" && "rotate-180")} />
            </button>

            {activeMenu === "apply" && (
              <div className="absolute left-0 top-full bg-background/95 backdrop-blur-xl border border-border/60 p-6 rounded-lg shadow-xl min-w-[420px] grid grid-cols-2 gap-6 animate-scale-in z-50">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-primary font-bold mb-3 border-b border-border/40 pb-1.5 flex items-center gap-1">
                    <Shield size={11} /> Application Form
                  </h4>
                  <div className="flex flex-col gap-1">
                    <Link to="/apply?type=application&category=individual" onClick={() => setActiveMenu(null)} className="text-xs uppercase tracking-wider text-foreground/80 hover:text-primary py-2 px-2.5 rounded hover:bg-muted/40 transition-colors block">
                      Individual Form
                    </Link>
                    <Link to="/apply?type=application&category=organization" onClick={() => setActiveMenu(null)} className="text-xs uppercase tracking-wider text-foreground/80 hover:text-primary py-2 px-2.5 rounded hover:bg-muted/40 transition-colors block">
                      Organization/<br />Corporate Form
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-primary font-bold mb-3 border-b border-border/40 pb-1.5 flex items-center gap-1">
                    <Award size={11} /> Claim Form
                  </h4>
                  <div className="flex flex-col gap-1">
                    <Link to="/apply?type=claim&category=individual" onClick={() => setActiveMenu(null)} className="text-xs uppercase tracking-wider text-foreground/80 hover:text-primary py-2 px-2.5 rounded hover:bg-muted/40 transition-colors block">
                      Individual Claim
                    </Link>
                    <Link to="/apply?type=claim&category=organization" onClick={() => setActiveMenu(null)} className="text-xs uppercase tracking-wider text-foreground/80 hover:text-primary py-2 px-2.5 rounded hover:bg-muted/40 transition-colors block">
                      Organization/<br />Corporate Claim
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown 2: Downloads */}
          <div
            className="relative py-4"
            onMouseEnter={() => setActiveMenu("downloads")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="text-xs uppercase tracking-[0.12em] xl:tracking-[0.18em] text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none select-none whitespace-nowrap">
              Downloads <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", activeMenu === "downloads" && "rotate-180")} />
            </button>

            {activeMenu === "downloads" && (
              <div className="absolute left-0 top-full bg-background/95 backdrop-blur-xl border border-border/60 p-4 rounded-lg shadow-xl min-w-[220px] flex flex-col gap-2.5 animate-scale-in z-50">
                <Link
                  to="/downloads"
                  onClick={() => setActiveMenu(null)}
                  className="text-xs uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors flex items-center py-1 font-mono"
                >
                  <FileText className="mr-2 h-4 w-4 text-primary" /> Application Form
                </Link>
                <Link
                  to="/downloads"
                  onClick={() => setActiveMenu(null)}
                  className="text-xs uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors flex items-center py-1 font-mono"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4 text-primary" /> Claim Form
                </Link>
                <Link
                  to="/rules"
                  onClick={() => setActiveMenu(null)}
                  className="text-xs uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors flex items-center py-1 font-mono"
                >
                  <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> Procedure & Rules
                </Link>
              </div>
            )}
          </div>

          <RouterNavLink
            to="/records"
            className={({ isActive }) =>
              cn(
                "text-xs uppercase tracking-[0.12em] xl:tracking-[0.18em] transition-all duration-300 px-2.5 xl:px-4 py-1.5 rounded-full whitespace-nowrap",
                isActive
                  ? "bg-gradient-gold-real text-[#080c1f] font-bold shadow-md"
                  : "text-foreground/80 hover:text-white hover:bg-[#080c1f]"
              )
            }
          >
            Record Gallery
          </RouterNavLink>

          <RouterNavLink
            to="/contact"
            className={({ isActive }) =>
              cn(
                "text-xs uppercase tracking-[0.12em] xl:tracking-[0.18em] transition-all duration-300 px-2.5 xl:px-4 py-1.5 rounded-full whitespace-nowrap",
                isActive
                  ? "bg-gradient-gold-real text-[#080c1f] font-bold shadow-md"
                  : "text-foreground/80 hover:text-primary hover:bg-muted/40"
              )
            }
          >
            Contact us
          </RouterNavLink>


        </nav>

        <div className="hidden xl:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Button asChild variant="heroOutline" size="sm">
                <Link to={isAdmin ? "/admin" : "/login"}>
                  {isAdmin ? "Admin Portal" : "User Portal"}
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-xs uppercase tracking-wider font-mono hover:text-red-500 font-bold">
                Log Out
              </Button>
            </>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>

        <div className="flex xl:hidden items-center gap-3">
          <ThemeToggle />
          <button
            className="text-foreground p-2"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="xl:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-fade-in max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="container py-6 flex flex-col gap-2">
            <RouterNavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "text-sm uppercase tracking-[0.18em] py-3 border-b border-border/40 block",
                  isActive ? "text-primary" : "text-foreground/80"
                )
              }
            >
              Home
            </RouterNavLink>
            <RouterNavLink
              to="/about"
              className={({ isActive }) =>
                cn(
                  "text-sm uppercase tracking-[0.18em] py-3 border-b border-border/40 block",
                  isActive ? "text-primary" : "text-foreground/80"
                )
              }
            >
              About us
            </RouterNavLink>

            {/* Accordion menus for Mobile */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="apply" className="border-b border-border/40">
                <AccordionTrigger className="text-sm uppercase tracking-[0.18em] text-foreground/80 hover:text-primary py-3 hover:no-underline [&[data-state=open]]:text-primary transition-all">
                  Apply for record
                </AccordionTrigger>
                <AccordionContent className="pl-4 pt-1 pb-3 flex flex-col gap-3 transition-all">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">Application Form</div>
                    <div className="flex flex-col gap-2 pl-2 border-l border-border/60">
                      <Link to="/apply?type=application&category=individual" className="text-xs uppercase tracking-wider text-foreground/75 hover:text-primary py-1 block">
                        Individual
                      </Link>
                      <Link to="/apply?type=application&category=organization" className="text-xs uppercase tracking-wider text-foreground/75 hover:text-primary py-1 block">
                        Organization/Corporate
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">Claim Form</div>
                    <div className="flex flex-col gap-2 pl-2 border-l border-border/60">
                      <Link to="/apply?type=claim&category=individual" className="text-xs uppercase tracking-wider text-foreground/75 hover:text-primary py-1 block">
                        Individual
                      </Link>
                      <Link to="/apply?type=claim&category=organization" className="text-xs uppercase tracking-wider text-foreground/75 hover:text-primary py-1 block">
                        Organization/Corporate
                      </Link>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="downloads" className="border-b border-border/40">
                <AccordionTrigger className="text-sm uppercase tracking-[0.18em] text-foreground/80 hover:text-primary py-3 hover:no-underline [&[data-state=open]]:text-primary transition-all">
                  Downloads
                </AccordionTrigger>
                <AccordionContent className="pl-4 pt-1 pb-2 flex flex-col gap-2 transition-all">
                  <Link to="/downloads" className="text-xs uppercase tracking-wider text-foreground/75 hover:text-primary py-2 flex items-center">
                    <FileText className="mr-2 h-3.5 w-3.5 text-primary" /> Application Form
                  </Link>
                  <Link to="/downloads" className="text-xs uppercase tracking-wider text-foreground/75 hover:text-primary py-2 flex items-center">
                    <ClipboardCheck className="mr-2 h-3.5 w-3.5 text-primary" /> Claim Form
                  </Link>
                  <Link to="/rules" className="text-xs uppercase tracking-wider text-foreground/75 hover:text-primary py-2 flex items-center">
                    <ShieldCheck className="mr-2 h-3.5 w-3.5 text-primary" /> Procedure & Rules
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <RouterNavLink
              to="/records"
              className={({ isActive }) =>
                cn(
                  "text-sm uppercase tracking-[0.18em] py-3 border-b border-border/40 block",
                  isActive ? "text-primary" : "text-foreground/80"
                )
              }
            >
              Record Gallery
            </RouterNavLink>
            <RouterNavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  "text-sm uppercase tracking-[0.18em] py-3 border-b border-border/40 block",
                  isActive ? "text-primary" : "text-foreground/80"
                )
              }
            >
              Contact us
            </RouterNavLink>



            {isLoggedIn ? (
              <>
                <Button asChild variant="heroOutline" className="mt-4 w-full">
                  <Link to={isAdmin ? "/admin" : "/login"}>
                    {isAdmin ? "Admin Portal" : "User Portal"}
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="mt-2 w-full text-xs uppercase tracking-wider font-mono text-red-500 hover:bg-red-500/10 font-bold">
                  Log Out
                </Button>
              </>
            ) : (
              <Button asChild variant="hero" className="mt-4 w-full">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
