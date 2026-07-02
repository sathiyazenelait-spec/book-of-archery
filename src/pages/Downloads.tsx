import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { FileText, Download, ShieldCheck, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

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
  },
  // {
  //   id: "rules-handbook",
  //   title: "ABWR Standard Procedure & Rules",
  //   filename: "ABWR_Standard_Procedure_And_Rules.txt",
  //   description: "The complete guidelines, safety protocols, target dimension standards, and shooting definitions for all official registry categories.",
  //   icon: <ShieldCheck className="text-primary h-6 w-6" />,
  //   fileSize: "2.4 MB",
  //   content: `ARCHERY BOOK OF WORLD RECORDS\nSTANDARD PROCEDURE & RULES HANDBOOK (2026 EDITION)\n==================================================\n\nSECTION A: GENERAL STANDARDS\n1. All attempts must be witnessed by at least two independent, qualified observers who have no affiliation or personal connection with the candidate.\n2. Calibration of any measuring equipment (tape measures, laser devices, stopwatches, wind gauges) must be verified and documented before shooting begins.\n3. No modified or prohibited auxiliary sights, mechanical releases, or stabilizing gear is permitted unless specifically authorized by the class rules.\n\nSECTION B: ARCHERY DIVISIONS\n1. RECURVE / TARGET ARCHERY: Standard FITA targets. Arrow diameters must not exceed 9.3mm.\n2. ENDURANCE & RANGE: Attempt must be conducted in open air under natural wind conditions.\n3. KIDS / JUNIOR CIRCUIT: Open to ages 7 to 15 under strict parental and range supervisor oversight.\n\nSECTION C: SAFETY PROTOCOLS\n1. A designated Safety Marshal must be present on-site.\n2. Attempt will be suspended if wind speeds exceed 25 knots or visibility drops below target distance.`
  // }
];

const Downloads = () => {
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

      <section className="container pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          {downloadItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 border border-border/60 bg-card/60 backdrop-blur-md hover:border-primary/40 transition-all duration-500 rounded-lg gap-6"
            >
              {/* Gold accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-l-lg" />

              <div className="flex gap-5 items-start pl-2">
                <div className="p-3 bg-primary/5 border border-primary/20 group-hover:border-primary/40 rounded-lg transition-colors shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground font-mono">
                    <span className="bg-muted px-2 py-0.5 rounded">{item.filename}</span>
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
          <div className="bg-primary/5 border text-justify border-primary/20 p-6 rounded-lg text-sm text-foreground/80 leading-relaxed">
            <strong>Important Note:</strong> All forms must be filled out completely. Scanned digital copies or text entries should be uploaded directly via the online portal. For on-site adjudications, please mail physical copies to our Geneva headquarters at least 30 days before your attempt.
          </div>
        </div>
      </section>
    </>
  );
};

export default Downloads;
