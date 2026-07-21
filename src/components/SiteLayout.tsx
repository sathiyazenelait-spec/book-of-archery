import { useState, useEffect } from "react";
import { Outlet, ScrollRestoration, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ArcheryBackgroundAnimation from "./ArcheryBackgroundAnimation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const logo = "/logo.jpeg";

const SiteLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem("archery-popup-shown", "true");
    console.log("Popup dismissed, sessionStorage flag set.");
  };

  const handleCancel = () => {
    handleDismiss();
  };

  const handleApplyNow = () => {
    handleDismiss();
    navigate("/apply");
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const dialogElement = document.querySelector('[role="dialog"]');
        const overlayElement = document.querySelector('.bg-black\\/80');
        console.log("DEBUG DIALOG IN DOM:", {
          dialogElement,
          dialogHtml: dialogElement?.outerHTML,
          dialogBoundingRect: dialogElement ? {
            top: dialogElement.getBoundingClientRect().top,
            left: dialogElement.getBoundingClientRect().left,
            width: dialogElement.getBoundingClientRect().width,
            height: dialogElement.getBoundingClientRect().height,
          } : null,
          overlayElement,
          bodyChildren: Array.from(document.body.children).map(el => ({
            tagName: el.tagName,
            id: el.id,
            className: el.className
          }))
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="min-h-screen  flex flex-col bg-background overflow-x-hidden">
      <ArcheryBackgroundAnimation />
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="animate-page-float">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ScrollRestoration />

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            sessionStorage.setItem("archery-popup-shown", "true");
            console.log("Popup closed, sessionStorage flag set.");
          }
        }}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-[550px] bg-card border border-border/60 text-card-foreground p-5 md:p-10 rounded-xl shadow-2xl overflow-visible"
        >
          {/* Subtle gold radial gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-radial-gold opacity-30 z-0 pointer-events-none" />

          {/* Top border gold line */}
          <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-gold z-10" />

          <div className="relative z-10 flex flex-col items-center text-center mt-2">
            <h2 className="font-display text-xl md:text-3xl text-foreground font-bold tracking-tight mb-3">
              Apply For ABWR World Records
            </h2>

            <img
              src={logo}
              alt="Archery Book of World Records Logo"
              className="h-14 w-14 md:h-28 md:w-28 rounded-full object-contain mb-3 drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)] animate-pulse"
            />

            <DialogHeader className="space-y-2.5">
              <DialogTitle className="text-xs md:text-lg font-semibold text-secondary dark:text-primary tracking-wide text-center">
                You Can Also Apply To Set OR Break The Records!!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-[10px] md:text-sm leading-relaxed text-justify mt-1.5 max-w-md mx-auto">
                To Apply for a Record, can you please submit your details with record achievement details in the official application form? Our adjudication team will reach out to you for evidence verification and certification. For any queries, contact us at <a href="mailto:info.abwr@yahoo.com" className="text-primary hover:underline font-medium">info.abwr@yahoo.com</a>.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="relative z-10 grid grid-cols-1 gap-4 mt-4 md:mt-8 sm:justify-stretch">
            <Button
              variant="hero"
              size="lg"
              onClick={handleApplyNow}
              className="w-full text-xs py-2.5 md:py-4 h-auto tracking-widest font-bold font-mono"
            >
              APPLY NOW
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteLayout;
