import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { FileText, Download, ShieldCheck, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DownloadItem {
  id: string;
  title: string;
  filename: string;
  description: string;
  icon: React.ReactNode;
  fileSize: string;
  content?: string;
  fileUrl?: string;
}

const downloadItems: DownloadItem[] = [
  {
    id: "app-form",
    title: "Archery Record Application Form",
    filename: "Archery_Record_Application_Form.pdf",
    description: "Submit this form to request official guidelines and adjudicator assignment prior to making your record attempt.",
    icon: <FileText className="text-primary h-6 w-6" />,
    fileSize: "5.8 KB",
    fileUrl: "/Archery_Record_Application_Form.pdf"
  },
  {
    id: "app-form-org",
    title: "Archery Record Application Form (Organizations)",
    filename: "Archery_Record_Application_Form_Organisations.pdf",
    description: "Submit this form to request official guidelines and adjudicator assignment for organization or corporate record attempts.",
    icon: <FileText className="text-primary h-6 w-6" />,
    fileSize: "7.5 KB",
    fileUrl: "/Archery_Record_Application_Form_Organisations.pdf"
  },
  {
    id: "claim-form",
    title: "Official Record Claim Form",
    filename: "Archery_Record_Claim_Form.pdf",
    description: "Submit this form post-attempt along with media assets, witness sign-offs, and logistics details to claim your record.",
    icon: <ClipboardCheck className="text-primary h-6 w-6" />,
    fileSize: "6.4 KB",
    fileUrl: "/Archery_Record_Claim_Form.pdf"
  }
];

const Downloads = () => {
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
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleDownload = (item: DownloadItem) => {
    try {
      if (item.fileUrl) {
        const link = document.createElement("a");
        link.href = item.fileUrl;
        link.download = item.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${item.filename} downloaded successfully!`);
        return;
      }
      const blob = new Blob([item.content || ""], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${item.filename} downloaded successfully!`);
    } catch (e) {
      toast.error("Download failed, please try again.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={<>Official Document <em className="text-gradient-gold not-italic">Downloads</em></>}
        description="Access official application packets, claim checklists, and regulatory rulebooks. Prepare your attempt according to ABWR global standards."
      />

      <section ref={sectionRef} className="container pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          {downloadItems.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 border border-[#d4af37]/25 bg-[#080c1f] text-white hover:border-[#d4af37]/65 transition-all duration-500 rounded-lg gap-6 shadow-md",
                "reveal-card",
                idx % 2 === 0 ? "reveal-left" : "reveal-right",
                revealed && "revealed"
              )}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Gold accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-l-lg" />

              <div className="flex gap-5 items-start pl-2">
                <div className="p-3 bg-primary/5 border border-primary/20 group-hover:border-primary/40 rounded-lg transition-colors shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-xl text-justify">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-400 font-mono">
                    <span className="bg-white/10 text-slate-200 px-2 py-0.5 rounded">{item.filename}</span>
                    <span>•</span>
                    <span>Size: {item.fileSize}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleDownload(item)}
                className="w-full md:w-auto shrink-0 bg-primary hover:bg-primary-glow text-primary-foreground font-medium flex items-center justify-center gap-2 px-6 py-5 rounded-md"
              >
                <Download size={16} /> Download
              </Button>
            </div>
          ))}

          {/* Quick Notice */}
          <div 
            className={cn(
              "bg-primary/5 border text-justify border-primary/20 p-6 rounded-lg text-sm text-[#aa771c] dark:text-[#d4af37] leading-relaxed",
              "reveal-card reveal-left",
              revealed && "revealed"
            )}
            style={{ transitionDelay: `${downloadItems.length * 150}ms` }}
          >
            <strong>Important Note:</strong> All forms must be filled out completely. Scanned digital copies or text entries should be uploaded directly via the online portal. For on-site adjudications, please mail physical copies to our Geneva headquarters at least 30 days before your attempt.
          </div>
        </div>
      </section>
    </>
  );
};

export default Downloads;
