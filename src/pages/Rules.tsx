import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  BookOpen, 
  Award, 
  FileSpreadsheet, 
  Users, 
  Calculator, 
  Mail, 
  Download, 
  Check, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Coins,
  MapPin,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { downloadRulesPdf } from "@/utils/pdfGenerator";

type TabId = "rules" | "claiming" | "certification" | "adjudication";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

export default function Rules() {
  const [activeTab, setActiveTab] = useState<TabId>("rules");

  // Calculator State
  const [applicantType, setApplicantType] = useState<"individual" | "organization" | "corporate">("individual");
  const [processingSpeed, setProcessingSpeed] = useState<"normal" | "rapid">("normal");
  const [inviteRmj, setInviteRmj] = useState<boolean>(false);
  const [rmjDays, setRmjDays] = useState<number>(1);
  const [overnightStay, setOvernightStay] = useState<boolean>(false);

  // Checklist State
  const [checkedEvidence, setCheckedEvidence] = useState<string[]>([]);

  const evidenceItems = [
    { id: "cover-letter", label: "Cover Letter", desc: "Containing detailed description and information about your attempted record." },
    { id: "participants", label: "Record Participant Details", desc: "List of all participants with their photographs and signatures." },
    { id: "witness-details", label: "Witness Details (Min 2)", desc: "Complete credentials of at least two witnesses with photos and signatures." },
    { id: "video-footage", label: "Video Footage", desc: "Continuous video coverage proving the validity of your attempt." },
    { id: "photos", label: "High-Quality Color Photos", desc: "Photographic proof of key details of the attempt." },
    { id: "media-coverage", label: "Media Coverage (Optional)", desc: "Any press releases, news clippings, or broadcast footage." }
  ];

  const handleToggleEvidence = (id: string) => {
    if (checkedEvidence.includes(id)) {
      setCheckedEvidence(checkedEvidence.filter(item => item !== id));
    } else {
      setCheckedEvidence([...checkedEvidence, id]);
    }
  };

  const checklistProgress = Math.round((checkedEvidence.length / evidenceItems.length) * 100);

  // Fee calculation logic
  const getProcessingFee = () => {
    if (processingSpeed === "normal") {
      if (applicantType === "individual") return 1000;
      if (applicantType === "organization") return 750;
      return 500; // corporate & govt
    } else {
      if (applicantType === "individual") return 2000;
      if (applicantType === "organization") return 1000;
      return 750; // corporate & govt
    }
  };

  const getRmjFee = () => {
    if (!inviteRmj) return 0;
    const baseRmj = rmjDays * 2000;
    const stayCost = overnightStay ? rmjDays * 1500 : 0;
    return baseRmj + stayCost;
  };

  const processingFee = getProcessingFee();
  const rmjFee = getRmjFee();
  const totalFee = processingFee + rmjFee;

  const handleDownload = (fileUrl: string, filename: string) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${filename} downloaded successfully!`);

      // Trigger simultaneous download of rules PDF synchronously (bypasses browser popup blocking)
      if (filename.includes("Application_Form")) {
        downloadRulesPdf("application");
      } else if (filename.includes("Claim_Form")) {
        downloadRulesPdf("claim");
      }
    } catch (e) {
      toast.error("Download failed, please try again.");
    }
  };

  const tabs: TabItem[] = [
    { id: "rules", label: "General Rules", icon: <BookOpen size={16} /> },
    { id: "claiming", label: "Claim Procedures", icon: <FileSpreadsheet size={16} /> },
    { id: "certification", label: "Certification Types", icon: <Award size={16} /> },
    { id: "adjudication", label: "RMJ Adjudication", icon: <ShieldCheck size={16} /> }
  ];

  return (
    <>
      <PageHeader
        eyebrow="Guidelines"
        title={<>Official Rules & <em className="text-gradient-gold not-italic">Certification</em></>}
        description="Review ABWR regulations, step-by-step claiming procedures, certificate duplicate options, processing fees, and adjudicator guidelines."
      />

      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Column (Left 2 Columns on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs Navigation */}
            <div className="flex flex-wrap border-b border-border/60 gap-1 sm:gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm uppercase tracking-wider font-medium transition-all duration-300 border-b-2 outline-none -mb-[2px] ${
                      isActive 
                        ? "border-primary text-primary font-bold" 
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="bg-card/40 border border-border/60 p-8 rounded-lg backdrop-blur-md min-h-[400px] transition-all duration-300">
              
              {/* Tab 1: General Rules */}
              {activeTab === "rules" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h2 className="font-display text-2xl uppercase tracking-wide">General Rules of ABWR</h2>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    ABWR maintains the highest standards of safety, ethics, and record accuracy. Every record candidate must strictly adhere to the general rules outlined below to ensure eligibility for official approval.
                  </p>

                  <div className="grid gap-4 mt-6">
                    <div className="p-5 border border-border/50 bg-background/30 rounded-md">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-primary" /> Safety & Moral Standards
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                        ABWR does not promote or accept attempts or world records that can potentially lead to any kind of destruction or harm to property, health, morality, or general well-being of an individual, organization, or society.
                      </p>
                    </div>

                    <div className="p-5 border border-border/50 bg-background/30 rounded-md">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-primary" /> Verification & Witness Presence
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                        At least <strong>two independent witnesses</strong> must be present during the record attempt. The complete details, photographs, and signatures of the witnesses must be enclosed with the official claim files. All verification documents must be duly signed by all witnesses.
                      </p>
                    </div>

                    <div className="p-5 border border-border/50 bg-background/30 rounded-md">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-primary" /> Team Presence & Offline Documents
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                        ABWR team members do not need to be present at the attempt site. Authenticity is maintained by having a Records Management Judge (RMJ) or local witnesses. To complete verification, online claimants in special cases must also mail physical copies of all required documents to the ABWR headquarters.
                      </p>
                    </div>

                    <div className="p-5 border border-border/50 bg-background/30 rounded-md">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-primary" /> Sole Authority
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                        Approval or disapproval of any world record attempt and certification is wholly and solely the final decision of the ABWR adjudication committee.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Claim Procedures */}
              {activeTab === "claiming" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h2 className="font-display text-2xl uppercase tracking-wide">Claiming Record Procedures</h2>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    A successful record attempt requires careful documentation. Follow the standardized procedures below to submit your record claim for formal assessment.
                  </p>

                  <div className="space-y-4 mt-6">
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 font-bold text-primary text-sm mt-0.5">1</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Download & Fill Application Form</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed text-justify">
                          Please <button onClick={() => handleDownload("/Archery_Record_Application_Form.pdf", "Archery_Record_Application_Form.pdf")} className="text-primary hover:underline font-semibold cursor-pointer p-0 bg-transparent border-none inline align-baseline">click here to download a record application form</button>. You have to take a print out of this form, fill it manually and send us a scanned copy. Once you’ve filled out the form completely you can submit it by sending an email to <a href="mailto:info@goldenbookofworldrecords.com" className="text-primary hover:underline font-semibold">info@goldenbookofworldrecords.com</a>. Incomplete forms may be rejected so try to fill all the details to the best of your knowledge.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 font-bold text-primary text-sm mt-0.5">2</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Record Attempt & Witness Sign-Off</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed text-justify">
                          Attempt the record with at least two witnesses present at the location. Ensure all witness information, photos, and signatures are collected, and all evidence documents are duly signed by the witnesses.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 font-bold text-primary text-sm mt-0.5">3</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Download & Prepare Claim Form</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed text-justify">
                          After you’ve attempted the record you’ll need to fill the records claim form and send an email to <a href="mailto:info@goldenbookofworldrecords.com" className="text-primary hover:underline font-semibold">info@goldenbookofworldrecords.com</a>. The claim has to be supported by all required evidence. Please <button onClick={() => handleDownload("/Archery_Record_Claim_Form.pdf", "Archery_Record_Claim_Form.pdf")} className="text-primary hover:underline font-semibold cursor-pointer p-0 bg-transparent border-none inline align-baseline">click here to download the Records Claim Form</button>.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 font-bold text-primary text-sm mt-0.5">4</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Email Submission or Physical Media</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed text-justify">
                          Send all forms and media to <a href="mailto:info@goldenbookofworldrecords.com" className="text-primary hover:underline font-semibold">info@goldenbookofworldrecords.com</a>, clearly mentioning the Claim ID, Applicant’s Name, Address, and Contact Details. Alternatively, a Pendrive/Hard Drive submitted as evidence can be sent to the ABWR office address with details clearly labeled.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 font-bold text-primary text-sm mt-0.5">5</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Verification & Retention Policy</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed text-justify font-normal">
                          Verification takes between 30 to 45 days. Documents and material submitted to ABWR become the property of ABWR and we are under no obligation to return any claim materials.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 p-4 rounded text-xs text-muted-foreground leading-relaxed mt-6">
                    <span className="font-semibold text-foreground">WARNING:</span> Incomplete claim forms or failure to supply mandatory witness sign-offs, photographs, or video evidence will result in the immediate rejection of the record claim.
                  </div>
                </div>
              )}

              {/* Tab 3: Certification Types */}
              {activeTab === "certification" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h2 className="font-display text-2xl uppercase tracking-wide">Record Certification Levels</h2>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    A world record is a monumental achievement. ABWR offers multiple certification options for record holders to display, duplicate, and personalize their achievements.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="border border-border/60 bg-background/20 p-6 rounded-md hover:border-primary/35 transition-colors relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-10 w-10 bg-primary/5 rounded-bl-full flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <Award size={16} />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Provisional Certificate</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                        Presented on the spot by an official RMJ immediately following successful onsite verification. Includes the record title, holder's name, date, and attempt venue to help you publicize your success instantly.
                      </p>
                    </div>

                    <div className="border border-border/60 bg-background/20 p-6 rounded-md hover:border-primary/35 transition-colors relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-10 w-10 bg-primary/5 rounded-bl-full flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <Award size={16} />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Duplicate Standard</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                        Allows certified record holders to request duplicates of their original standard certificates. These standard duplicates come with the official ABWR seal and can be presented on-site by a judge or mailed.
                      </p>
                    </div>

                    <div className="border border-border/60 bg-background/20 p-6 rounded-md hover:border-primary/35 transition-colors relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-10 w-10 bg-primary/5 rounded-bl-full flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <Award size={16} />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Personalized Certificate</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                        Designed for mass participation attempts. Allows participants and organizers to request edited standard certificates mentioning their specific names and coordination details as approved by GBWR/ABWR.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-md mt-6 flex gap-4 items-start">
                    <HelpCircle className="text-primary shrink-0 mt-0.5" size={20} />
                    <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                      <strong>Logo Branding:</strong> Use of ABWR's logo at record events is encouraged to generate excitement and media coverage. The GBWR logo can be printed on T-shirts, banners, and brochures with prior written permission.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Adjudicator Guidelines */}
              {activeTab === "adjudication" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h2 className="font-display text-2xl uppercase tracking-wide">Inviting a Records Management Judge</h2>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    Invite an official ABWR Records Adjudicator (RMJ) to your location for on-the-spot recognition, instant verification, and immediate certification of your record attempt.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="p-5 border border-border/50 bg-background/30 rounded-md">
                      <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-primary" /> Advance Booking Notice
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                        The ABWR team must be notified at least <strong>one month (30 days) prior</strong> to the planned date of the attempt to arrange and schedule judge availability.
                      </p>
                    </div>

                    <div className="p-5 border border-border/50 bg-background/30 rounded-md">
                      <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-primary" /> Travel & Lodging Norms
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                        It is mandatory for the record attempter, organization, or sponsors to arrange and pay for the travel and lodging expenses of the assigned RMJ according to Golden Book guidelines.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-md mt-6">
                    <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
                      On-the-spot Certification Policy
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                      If the attempt succeeds, the RMJ can present the provisional certificate immediately. On-site certification is solely dependent on the complete verification and satisfaction of the adjudicator based on standard regulatory frameworks. For mass records, adjudicator requirements depend on the participant count.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Form Downloads and Submit Area */}
            <div className="bg-gradient-to-r from-card/30 to-card/50 border border-border/60 p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Ready to start your record journey?</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl text-justify">
                  Download the application form, fill out the required details manually, scan it, and submit the copy to <a href="mailto:info@goldenbookofworldrecords.com" className="text-primary hover:underline font-semibold">info@goldenbookofworldrecords.com</a>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <Button variant="outline" asChild className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider py-5">
                  <Link to="/downloads">
                    <Download className="mr-2 h-4 w-4 text-primary" /> Document Center
                  </Link>
                </Button>
                <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary-glow text-primary-foreground font-mono text-xs uppercase tracking-wider py-5">
                  <a href="mailto:info@goldenbookofworldrecords.com">
                    <Mail className="mr-2 h-4 w-4" /> Send Email
                  </a>
                </Button>
              </div>
            </div>

          </div>

          {/* Sticky Calculator & Checklist Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-24">
            
            {/* Calculator Card */}
            <div className="bg-card border border-border/60 p-6 rounded-lg relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-gold" />
              <h3 className="font-display text-lg uppercase tracking-wider flex items-center gap-2 mb-5">
                <Calculator size={18} className="text-primary" /> Cost & Fee Estimator
              </h3>

              <div className="space-y-4">
                {/* Applicant Type Selection */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Applicant Category</label>
                  <div className="grid grid-cols-3 gap-1 bg-muted/40 p-1 rounded-md border border-border/40">
                    {(["individual", "organization", "corporate"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setApplicantType(type)}
                        className={`text-[9px] uppercase tracking-wider py-2 font-medium rounded-sm transition-all duration-300 ${
                          applicantType === type
                            ? "bg-primary text-primary-foreground font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {type === "corporate" ? "Corp / Gov" : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Processing Speed Selection */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Processing Timeline</label>
                  <div className="grid grid-cols-2 gap-1 bg-muted/40 p-1 rounded-md border border-border/40">
                    {(["normal", "rapid"] as const).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setProcessingSpeed(speed)}
                        className={`text-[9px] uppercase tracking-wider py-2 font-medium rounded-sm transition-all duration-300 ${
                          processingSpeed === speed
                            ? "bg-primary text-primary-foreground font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {speed === "normal" ? "Normal (3-4 mo)" : "Rapid (1 mo)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RMJ Adjudicator Toggle */}
                <div className="border-t border-border/40 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Invite Official Adjudicator</span>
                    <span className="text-[9px] text-muted-foreground">On-the-spot verification</span>
                  </div>
                  <button 
                    onClick={() => setInviteRmj(!inviteRmj)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${inviteRmj ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${inviteRmj ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* RMJ specific options */}
                {inviteRmj && (
                  <div className="bg-muted/30 p-3.5 border border-border/40 rounded space-y-3.5 animate-scale-in">
                    <div>
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold block mb-1">Adjudication Duration (Days)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={rmjDays}
                        onChange={(e) => setRmjDays(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-background border border-border text-foreground px-2.5 py-1.5 text-xs rounded outline-none focus:border-primary/50 font-mono"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-foreground">Overnight Stay Required</span>
                        <span className="text-[8px] text-muted-foreground">Stay exceeds 24 hours</span>
                      </div>
                      <button 
                        onClick={() => setOvernightStay(!overnightStay)}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${overnightStay ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                      >
                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${overnightStay ? 'translate-x-3' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Estimate Breakdown */}
                <div className="border-t border-border/60 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Processing Charge</span>
                    <span className="font-mono">INR {processingFee.toLocaleString()}</span>
                  </div>

                  {inviteRmj && (
                    <>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Adjudication (RMJ)</span>
                        <span className="font-mono">INR {(rmjDays * 2000).toLocaleString()}</span>
                      </div>
                      {overnightStay && (
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Overnight Stay Charge</span>
                          <span className="font-mono">INR {(rmjDays * 1500).toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="border-t border-border/40 pt-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">Estimated Total</span>
                    <span className="text-base font-mono font-bold text-primary">INR {totalFee.toLocaleString()}</span>
                  </div>
                  
                  <p className="text-[9px] text-muted-foreground text-center italic mt-2">
                    * The above estimate excludes taxes. Additional government tax is applicable.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Card */}
            <div className="bg-card border border-border/60 p-6 rounded-lg relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-gold" />
              <h3 className="font-display text-lg uppercase tracking-wider flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-primary" /> Evidence Prep Tracker
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-5 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Requirements met</span>
                  <span className="text-primary font-bold">{checklistProgress}%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden border border-border/20">
                  <div 
                    className="bg-gradient-gold h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3.5">
                {evidenceItems.map((item) => {
                  const isChecked = checkedEvidence.includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleToggleEvidence(item.id)}
                      className={`flex gap-3 items-start p-2 rounded cursor-pointer transition-colors duration-250 ${
                        isChecked ? "bg-primary/5 hover:bg-primary/8" : "hover:bg-muted/30"
                      }`}
                    >
                      <button
                        className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                          isChecked 
                            ? "bg-primary border-primary text-primary-foreground font-bold shadow-sm" 
                            : "border-border bg-background"
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </button>
                      <div>
                        <span className={`text-xs font-semibold block leading-tight ${isChecked ? "text-foreground line-through decoration-primary/30" : "text-foreground"}`}>
                          {item.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground leading-normal mt-0.5 block">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {checklistProgress === 100 && (
                <div className="mt-5 p-3.5 bg-primary/10 border border-primary/20 rounded text-center animate-scale-in">
                  <p className="text-[11px] text-primary font-bold uppercase tracking-wider mb-1">Evidence complete!</p>
                  <p className="text-[9px] text-muted-foreground">You have all files ready. Compile and submit your claim to ABWR.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
