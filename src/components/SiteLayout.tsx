import { useState, useEffect } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const logo = "/archery_image.png";

const SiteLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear legacy localStorage key if present
    localStorage.removeItem("archery-popup-shown");

    const hasShown = sessionStorage.getItem("archery-popup-shown");
    console.log("Popup hasShown state in sessionStorage:", hasShown);
    if (!hasShown) {
      const timer = setTimeout(() => {
        console.log("Showing popup now...");
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
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
          className="sm:max-w-[550px] bg-card/95 backdrop-blur-md border border-border/60 text-card-foreground p-8 md:p-10 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-gold" />

          <div className="flex flex-col items-center text-center mt-4">
            <img
              src={logo}
              alt="Archery Book of World Records Logo"
              className="h-20 w-20 md:h-24 md:w-24 object-contain mb-6 animate-pulse drop-shadow-[0_0_12px_rgba(202,138,4,0.3)]"
            />

            <DialogHeader>
              <DialogTitle className="font-display text-3xl md:text-4xl text-center leading-tight">
                Welcome to the <span className="text-gradient-gold block sm:inline">Archery Hub</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-4 text-base leading-relaxed text-center">
                Are you ready to showcase your accuracy? Apply now to register your official record attempt or submit your evidence to the global registry.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="grid grid-cols-1 gap-4 mt-8 sm:justify-stretch">
            {/* <Button 
              variant="outline" 
              size="lg"
              onClick={handleCancel}
              className="w-full border-border hover:bg-muted/50 hover:text-foreground"
            >
              Cancel
            </Button> */}
            <Button
              variant="hero"
              size="lg"
              onClick={handleApplyNow}
              className="w-full"
            >
              Apply Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteLayout;
