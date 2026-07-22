import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, saveSubmissionApi } from "@/data/records";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Users,
  CheckCircle2,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const stepLabels = ["Type & Category", "Applicant Information", "Attempt Details", "Approvals & Evidence"];

interface TeamMember {
  fullName: string;
  role: string; // Shooter / Captain / Alternate
  ageCategory: string;
  discipline: string;
}

interface ApplyForm {
  formType: "application" | "claim";
  category: "individual" | "organization" | "corporate";
  profilePhoto: string;

  // 1. Individual Information
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  ageCategory: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  phone: string;

  // 2. Archery Profile
  discipline: string;
  bowType: string;
  clubAffiliation: string;
  experienceYears: string;
  coachName: string;
  federationId: string;

  // 3. Organisation Details
  orgName: string;
  orgType: string; // Federation / Club / Academy / Company / Other
  orgRegNumber: string;
  orgCountry: string;
  orgAddress: string;
  orgCity: string;
  orgState: string;
  orgPostalCode: string;
  orgContactPerson: string;
  orgContactDesignation: string;
  orgContactEmail: string;
  orgContactPhone: string;

  // Attempt Mode (Organisation only)
  orgAttemptType: "individual" | "team";

  // Section 3A: Individual applicant details (if organisation individual attempt)
  orgIndName: string;
  orgIndDob: string;
  orgIndGender: string;
  orgIndNationality: string;
  orgIndAgeCategory: string;
  orgIndDiscipline: string;
  orgIndBowType: string;

  // Section 3B: Team roster (list of up to 5 members)
  teamRoster: TeamMember[];

  // 4. Record/Attempt Details
  recordTitle: string;
  recordCategory: string;
  targetDistance: string;
  attemptDate: string;
  venue: string;
  existingRecord: string;
  currentRecordValue: string;
  officiatingBody: string;
  witnessCount: string;
  equipmentDetails: string;

  // 5. Evidence Checklist & Metadata (Claim only)
  evidenceVideo: boolean;
  evidencePhoto: boolean;
  evidenceScorecard: boolean;
  evidenceWitness: boolean;
  evidenceEquipment: boolean;
  evidenceThirdParty: boolean;
  evidenceDescription: string;
  thirdPartyBody: string;
  thirdPartyRef: string;

  // 6. Parent/Guardian Approval
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  parentEmail: string;

  // 7. School/Institution Approval
  schoolName: string;
  schoolRegId: string;
  schoolOfficialName: string;
  schoolOfficialDesignation: string;

  // 8. Witness/Coach Approval (Claim only)
  witnessApprovalType: "witness" | "coach";
  witnessApproverName: string;
  witnessApproverRelationship: string;

  // Organisation Rep & Witnessing Official (Organisation only)
  orgRepName: string;
  orgRepDesignation: string;
  orgWitnessName: string;
  orgWitnessDesignation: string;

  // Common description fields
  description: string;
  achievedResult: string;
  witnessInfo: string;
}

const emptyForm: ApplyForm = {
  formType: "application",
  category: "individual",
  profilePhoto: "",
  name: "",
  dob: "",
  gender: "Male",
  nationality: "",
  ageCategory: "Senior",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  email: "",
  phone: "",
  discipline: "Recurve",
  bowType: "",
  clubAffiliation: "",
  experienceYears: "",
  coachName: "",
  federationId: "",
  orgName: "",
  orgType: "Club",
  orgRegNumber: "",
  orgCountry: "",
  orgAddress: "",
  orgCity: "",
  orgState: "",
  orgPostalCode: "",
  orgContactPerson: "",
  orgContactDesignation: "",
  orgContactEmail: "",
  orgContactPhone: "",
  orgAttemptType: "individual",
  orgIndName: "",
  orgIndDob: "",
  orgIndGender: "Male",
  orgIndNationality: "",
  orgIndAgeCategory: "Senior",
  orgIndDiscipline: "Recurve",
  orgIndBowType: "",
  teamRoster: [
    { fullName: "", role: "Shooter", ageCategory: "Senior", discipline: "Recurve" },
    { fullName: "", role: "Shooter", ageCategory: "Senior", discipline: "Recurve" },
    { fullName: "", role: "Shooter", ageCategory: "Senior", discipline: "Recurve" },
    { fullName: "", role: "Shooter", ageCategory: "Senior", discipline: "Recurve" },
    { fullName: "", role: "Shooter", ageCategory: "Senior", discipline: "Recurve" }
  ],
  recordTitle: "",
  recordCategory: "Archery Performance Records",
  targetDistance: "",
  attemptDate: "",
  venue: "",
  existingRecord: "",
  currentRecordValue: "",
  officiatingBody: "",
  witnessCount: "",
  equipmentDetails: "",
  evidenceVideo: false,
  evidencePhoto: false,
  evidenceScorecard: false,
  evidenceWitness: false,
  evidenceEquipment: false,
  evidenceThirdParty: false,
  evidenceDescription: "",
  thirdPartyBody: "",
  thirdPartyRef: "",
  parentName: "",
  parentRelationship: "",
  parentPhone: "",
  parentEmail: "",
  schoolName: "",
  schoolRegId: "",
  schoolOfficialName: "",
  schoolOfficialDesignation: "",
  witnessApprovalType: "witness",
  witnessApproverName: "",
  witnessApproverRelationship: "",
  orgRepName: "",
  orgRepDesignation: "",
  orgWitnessName: "",
  orgWitnessDesignation: "",
  description: "",
  achievedResult: "",
  witnessInfo: ""
};

const generateId = (type: string) =>
  `ABWR-${type === "application" ? "APP" : "CLM"}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const Apply = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ApplyForm>(emptyForm);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handlePhotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Downscale the image to max 300x300 for clean preview and fast storage
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 70% quality jpeg
            update("profilePhoto", compressedBase64);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profile-photo-hidden-input")?.click();
  };

  const isLoggedIn = sessionStorage.getItem("abwr_admin_is_logged_in") === "true";

  const getParsedToken = () => {
    const token = sessionStorage.getItem("abwr_admin_token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  // Sync with search query parameters and user credentials on load
  useEffect(() => {
    if (!isLoggedIn) return;

    const currentUser = getParsedToken();
    const typeParam = searchParams.get("type");
    const catParam = searchParams.get("category");

    const validTypes = ["application", "claim"];
    const validCats = ["individual", "organization", "corporate"];

    setForm(prev => ({
      ...prev,
      formType: typeParam && validTypes.includes(typeParam) ? (typeParam as "application" | "claim") : prev.formType,
      category: catParam && validCats.includes(catParam) ? (catParam as "individual" | "organization" | "corporate") : prev.category,
      name: prev.name || (currentUser ? currentUser.username : ""),
      email: prev.email || (currentUser && currentUser.email ? currentUser.email : "")
    }));

    if (typeParam && catParam && validTypes.includes(typeParam) && validCats.includes(catParam)) {
      setStep(1);
    }
  }, [searchParams, isLoggedIn]);

  const update = <K extends keyof ApplyForm>(key: K, v: ApplyForm[K]) => {
    setForm((s) => ({ ...s, [key]: v }));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, val: string) => {
    setForm((s) => {
      const copy = [...s.teamRoster];
      copy[index] = { ...copy[index], [field]: val };
      return { ...s, teamRoster: copy };
    });
  };

  const validateStep = () => {
    if (step === 0) return true;

    if (step === 1) {
      if (form.category === "individual") {
        if (!form.name.trim() || !form.dob.trim() || !form.nationality.trim() || !form.address.trim() || !form.email.trim() || !form.phone.trim() || !form.bowType.trim()) {
          toast.error("Please fill in all mandatory applicant details & profile fields.");
          return false;
        }
      } else {
        if (!form.orgName.trim() || !form.orgRegNumber.trim() || !form.orgAddress.trim() || !form.orgContactPerson.trim() || !form.orgContactEmail.trim() || !form.orgContactPhone.trim()) {
          toast.error("Please fill in all mandatory organisation details.");
          return false;
        }
        if (form.orgAttemptType === "individual" && (!form.orgIndName.trim() || !form.orgIndDob.trim() || !form.orgIndBowType.trim())) {
          toast.error("Please enter Section 3A individual details.");
          return false;
        }
        if (form.orgAttemptType === "team" && !form.teamRoster[0].fullName.trim()) {
          toast.error("Please enter at least member 1 full name in Section 3B roster.");
          return false;
        }
      }
      return true;
    }

    if (step === 2) {
      if (!form.recordTitle.trim() || !form.venue.trim() || !form.attemptDate.trim() || !form.targetDistance.trim() || !form.officiatingBody.trim() || !form.equipmentDetails.trim()) {
        toast.error("Please fill in all mandatory record attempt parameters.");
        return false;
      }
      if (form.formType === "claim" && !form.achievedResult.trim()) {
        toast.error("Please specify your measured / achieved result.");
        return false;
      }
      return true;
    }

    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    const id = generateId(form.formType);

    // Auto-populate legacy fields mapping for schema compatibility
    const submissionPayload = {
      id,
      formType: form.formType,
      category: form.category,
      name: form.category === "individual" ? form.name : (form.orgAttemptType === "individual" ? form.orgIndName : "Team Attempt"),
      dob: form.category === "individual" ? form.dob : (form.orgAttemptType === "individual" ? form.orgIndDob : null),
      orgName: form.category !== "individual" ? form.orgName : null,
      orgType: form.category !== "individual" ? form.orgType : null,
      repName: form.category !== "individual" ? form.orgContactPerson : null,
      companyName: form.category === "corporate" ? form.orgName : (form.category === "organization" && form.orgType === "Company" ? form.orgName : null),
      companyReg: form.category === "corporate" ? form.orgRegNumber : (form.category === "organization" && form.orgType === "Company" ? form.orgRegNumber : null),
      email: form.category === "individual" ? form.email : form.orgContactEmail,
      phone: form.category === "individual" ? form.phone : form.orgContactPhone,
      recordTitle: form.recordTitle,
      recordCategory: form.recordCategory,
      description: form.description || `Attempt at ${form.venue}. Equipment: ${form.equipmentDetails}. Officiated by ${form.officiatingBody}.`,
      attemptDate: form.attemptDate,
      venue: form.venue,
      achievedResult: form.achievedResult || "Pending",
      witnessInfo: form.formType === "claim" ? `Witness Name: ${form.witnessApproverName} (${form.witnessApproverRelationship}). Counts: ${form.witnessCount}` : `Adjudication Judges: ${form.officiatingBody}`,
      status: "pending" as const,
      submittedAt: new Date().toISOString(),
      formData: form // Contains full PDF-mapped inputs payload as JSON!
    };

    const success = await saveSubmissionApi(submissionPayload);
    if (success) {
      setSubmitted(id);
    } else {
      toast.error("Failed to store submission on database. Verify server link.");
    }
  };

  const resetForm = () => {
    setSubmitted(null);
    setForm(emptyForm);
    setStep(0);
    setSearchParams({});
    setAcceptTerms(false);
  };

  const formTypeName = form.formType === "application" ? "Application" : "Official Claim";
  const formCategoryName = form.category.charAt(0).toUpperCase() + form.category.slice(1);

  if (!isLoggedIn) {
    return (
      <>
        <PageHeader
          eyebrow="Access Restriction"
          title={<>Authentication <em className="text-gradient-gold not-italic">Required</em></>}
          description="You must log in to submit a world record application or claim."
        />
        <section className="container pb-32 flex flex-col items-center justify-center space-y-6">
          <div className="max-w-md text-center bg-card/65 backdrop-blur-md border border-border/60 p-8 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-gold" />
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="text-primary" size={20} />
            </div>
            <h3 className="font-display text-xl mb-3 text-foreground">Sign In Required</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Standard user or administrative authentication is required before filing a record application or claim.
            </p>
            <Button asChild variant="hero" className="w-full">
              <Link to="/login">Go to Portal Login</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Submission Received"
          title={<>{formTypeName} <em className="text-gradient-gold not-italic">Registered.</em></>}
          description={form.formType === "application"
            ? "Your application is under evaluation. An adjudicator will contact you with specific guidelines shortly."
            : "Your claim assets and witness signatures have been queued for review by the official ABWR panel."}
        />
        <section className="container pb-32">
          <div className="max-w-xl mx-auto bg-card border border-border/60 p-12 text-center rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <Check className="text-primary" size={28} />
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Submission Reference ID</div>
            <div className="font-display text-3xl text-gradient-gold mb-8 tracking-wider">{submitted}</div>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
              We have dispatched a confirmation receipt. Please retain this ID for check-ins.
            </p>
            <Button asChild variant="heroOutline">
              <Link to="/">Close</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Registry Portal"
        title={<>{formCategoryName} <em className="text-gradient-gold not-italic">{formTypeName}</em></>}
        description="Ensure your archery attempt meets our global specifications. Adjudication runs on a 14-day cycle."
      />

      <section className="container pb-32">
        <div className="max-w-3xl mx-auto">

          {/* Stepper */}
          <ol className="flex items-center justify-between mb-14 px-4 overflow-x-auto">
            {stepLabels.map((label, i) => (
              <li key={label} className="flex-1 flex items-center min-w-[120px] last:min-w-fit">
                <div className="flex flex-col items-center text-center w-full">
                  <div className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center text-xs transition-all duration-300 font-mono",
                    i < step && "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(214,156,39,0.2)]",
                    i === step && "border-primary text-primary font-bold bg-primary/5 ring-4 ring-primary/10",
                    i > step && "border-border/60 text-muted-foreground"
                  )}>
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <span className={cn("text-[10px] uppercase tracking-[0.2em] mt-2 whitespace-nowrap", i === step ? "text-primary font-semibold" : "text-muted-foreground/80")}>
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={cn("h-px flex-1 mx-2 mb-5 hidden sm:block", i < step ? "bg-primary" : "bg-border/60")} />
                )}
              </li>
            ))}
          </ol>

          {/* Form Container */}
          <div className="bg-card/50 backdrop-blur-md border border-border/60 p-8 md:p-12 rounded-lg shadow-xl relative">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Top-Left Square Placeholder as Profile Photo / Logo Preview */}
            {step > 0 && (
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8 pb-6 border-b border-border/40">
                <div 
                  onClick={triggerFileInput}
                  className="w-24 h-24 border-2 border-dashed border-border hover:border-primary/50 transition-all rounded-lg flex flex-col items-center justify-center shrink-0 overflow-hidden bg-muted/20 relative group cursor-pointer"
                  title="Click to upload profile photo / logo"
                >
                  {form.profilePhoto ? (
                    <img src={form.profilePhoto} alt="Profile/Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-center p-2 select-none">
                      <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                        <Users className="text-primary h-4 w-4" />
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground">Add Photo</span>
                    </div>
                  )}
                  {/* Invisible file input */}
                  <input
                    id="profile-photo-hidden-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoInputChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-mono font-bold">
                    {formCategoryName} {formTypeName}
                  </span>
                  <h2 className="font-display text-2xl text-foreground mt-1">
                    {form.category === "individual" ? (form.name || "Archer Profile") : (form.orgName || "Organization Profile")}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Click the square placeholder to upload or update your {form.category === "individual" ? "profile photo" : "organization logo"}.
                  </p>
                </div>
                {/* Default ABWR Logo on the right side corner */}
                <div className="w-16 h-16 border border-border/40 rounded-lg overflow-hidden shrink-0 hidden sm:block bg-background/50">
                  <img src="/logo.jpeg" alt="ABWR Logo" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* STEP 0: TYPE & CATEGORY SELECTOR */}
            {step === 0 && (
              <div className="space-y-8 animate-scale-in">
                <div className="border-b border-border/60 pb-5">
                  <h2 className="font-display text-3xl text-foreground">Select Submission Model</h2>
                  <p className="text-sm text-muted-foreground mt-2">Choose the type of submission and your applicant status to configure the form.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Select Submission Type */}
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-primary">Submission Goal</Label>
                    <div className="grid gap-4">
                      <button
                        type="button"
                        onClick={() => update("formType", "application")}
                        className={cn(
                          "flex items-start gap-4 p-5 text-left border rounded-lg transition-all duration-300",
                          form.formType === "application"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-foreground/30 hover:bg-muted/30"
                        )}
                      >
                        <Shield className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Application Form</h4>
                          <p className="text-xs text-muted-foreground mt-1">For planning a future record attempt. Request guidelines and adjudicator assignment before shooting.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => update("formType", "claim")}
                        className={cn(
                          "flex items-start gap-4 p-5 text-left border rounded-lg transition-all duration-300",
                          form.formType === "claim"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-foreground/30 hover:bg-muted/30"
                        )}
                      >
                        <Award className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Claim Form</h4>
                          <p className="text-xs text-muted-foreground mt-1">For submitting evidence and witness credentials of a completed record attempt.</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Select Category */}
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-primary">Applicant Category</Label>
                    <div className="grid gap-4">
                      {(["individual", "organization"] as const).map((cat) => {
                        const isSelected = cat === "individual"
                          ? form.category === "individual"
                          : (form.category === "organization" || form.category === "corporate");
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => update("category", cat === "organization" && form.category === "corporate" ? "corporate" : cat)}
                            className={cn(
                              "flex items-center gap-4 p-4 text-left border rounded-lg transition-all duration-300 capitalize",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border hover:border-foreground/30 hover:bg-muted/30"
                            )}
                          >
                            <Users className="h-5 w-5 text-primary/80 shrink-0" />
                            <div>
                              <span className="font-semibold text-sm">
                                {cat === "organization" ? "Organization/Corporate" : cat}
                              </span>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {cat === "individual" && "Attempt by a single archer (Individual form)."}
                                {cat === "organization" && "Attempt by club, school, company, corporate or team (Organization/Corporate form)."}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: APPLICANT/ORGANISATION DETAILS */}
            {step === 1 && (
              <div className="space-y-8 animate-scale-in">
                {form.category === "individual" ? (
                  /* INDIVIDUAL DETAILS & ARCHERY PROFILE */
                  <>
                    <div className="border-b border-border/60 pb-5">
                      <h3 className="font-display text-2xl text-foreground">Section 1. Applicant Information</h3>
                      <p className="text-xs text-muted-foreground mt-1">Provide individual details matching your registry identity.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="Full Legal Name *">
                        <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full legal name" required />
                      </Field>
                      <Field label="Date of Birth *">
                        <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} required />
                      </Field>
                      <Field label="Gender *">
                        <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Nationality *">
                        <Input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} placeholder="Country name" required />
                      </Field>
                      <Field label="Age Category *">
                        <Select value={form.ageCategory} onValueChange={(v) => update("ageCategory", v)}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Veteran">Veteran</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Residential Address *">
                        <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="House, street, landmark" required />
                      </Field>
                      <Field label="City *">
                        <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" required />
                      </Field>
                      <Field label="State / Province *">
                        <Input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="State" required />
                      </Field>
                      <Field label="Postal Code *">
                        <Input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="PIN / Postal Code" required />
                      </Field>
                      <Field label="Email Address *">
                        <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@domain.com" required />
                      </Field>
                      <Field label="Phone Number *">
                        <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Primary contact phone" required />
                      </Field>
                      <Field label="Upload Profile Photo (Optional)">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoInputChange}
                          className="cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </Field>
                    </div>

                    <div className="border-b border-border/60 pb-5 pt-6">
                      <h3 className="font-display text-2xl text-foreground">Section 2. Archery Profile</h3>
                      <p className="text-xs text-muted-foreground mt-1">Detail your sports discipline parameters.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="Discipline *">
                        <Select value={form.discipline} onValueChange={(v) => update("discipline", v)}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Recurve">Recurve</SelectItem>
                            <SelectItem value="Compound">Compound</SelectItem>
                            <SelectItem value="Traditional">Traditional</SelectItem>
                            <SelectItem value="Para-archery">Para-archery</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Bow Type *">
                        <Input value={form.bowType} onChange={(e) => update("bowType", e.target.value)} placeholder="e.g. Barebow, Olympic Recurve, Longbow" required />
                      </Field>
                      <Field label="Club / Academy Affiliation *">
                        <Input value={form.clubAffiliation} onChange={(e) => update("clubAffiliation", e.target.value)} placeholder="Name of range or academy" required />
                      </Field>
                      <Field label="Years of Competitive Experience *">
                        <Input type="number" value={form.experienceYears} onChange={(e) => update("experienceYears", e.target.value)} placeholder="e.g. 5" required />
                      </Field>
                      <Field label="Coach Name (If applicable)">
                        <Input value={form.coachName} onChange={(e) => update("coachName", e.target.value)} placeholder="Coach's Name" />
                      </Field>
                      <Field label="National Federation ID (If any)">
                        <Input value={form.federationId} onChange={(e) => update("federationId", e.target.value)} placeholder="License/ID Code" />
                      </Field>
                    </div>
                  </>
                ) : (
                  /* ORGANISATION DETAILS & ATTEMPT MODE */
                  <>
                    <div className="border-b border-border/60 pb-5">
                      <h3 className="font-display text-2xl text-foreground">Section 1. Organization / Corporate Details</h3>
                      <p className="text-xs text-muted-foreground mt-1">Provide legal entity profile coordinates.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="Category *">
                        <Select value={form.category === "corporate" ? "corporate" : "organization"} onValueChange={(v) => update("category", v as "organization" | "corporate")}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="organization">Organization</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Organization / Corporate / Federation / Club Name *">
                        <Input value={form.orgName} onChange={(e) => update("orgName", e.target.value)} placeholder="Legal name" required />
                      </Field>
                      <Field label="Entity Type *">
                        <Select value={form.orgType} onValueChange={(v) => update("orgType", v)}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Federation">Federation</SelectItem>
                            <SelectItem value="Club">Club</SelectItem>
                            <SelectItem value="Academy">Academy</SelectItem>
                            <SelectItem value="Company">Company</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Registration / Legal Entity Number *">
                        <Input value={form.orgRegNumber} onChange={(e) => update("orgRegNumber", e.target.value)} placeholder="Registration Number" required />
                      </Field>
                      <Field label="Country of Registration *">
                        <Input value={form.orgCountry} onChange={(e) => update("orgCountry", e.target.value)} placeholder="Country" required />
                      </Field>
                      <Field label="Head Office Address *">
                        <Input value={form.orgAddress} onChange={(e) => update("orgAddress", e.target.value)} placeholder="Street address" required />
                      </Field>
                      <Field label="City *">
                        <Input value={form.orgCity} onChange={(e) => update("orgCity", e.target.value)} placeholder="City" required />
                      </Field>
                      <Field label="State / Province *">
                        <Input value={form.orgState} onChange={(e) => update("orgState", e.target.value)} placeholder="State" required />
                      </Field>
                      <Field label="Postal Code *">
                        <Input value={form.orgPostalCode} onChange={(e) => update("orgPostalCode", e.target.value)} placeholder="PIN / Postal Code" required />
                      </Field>
                      <Field label="Authorized Contact Person *">
                        <Input value={form.orgContactPerson} onChange={(e) => update("orgContactPerson", e.target.value)} placeholder="Representative name" required />
                      </Field>
                      <Field label="Designation / Title *">
                        <Input value={form.orgContactDesignation} onChange={(e) => update("orgContactDesignation", e.target.value)} placeholder="Designation" required />
                      </Field>
                      <Field label="Contact Email Address *">
                        <Input type="email" value={form.orgContactEmail} onChange={(e) => update("orgContactEmail", e.target.value)} placeholder="contact@org.com" required />
                      </Field>
                      <Field label="Contact Phone Number *">
                        <Input value={form.orgContactPhone} onChange={(e) => update("orgContactPhone", e.target.value)} placeholder="Contact number" required />
                      </Field>
                      <Field label="Upload Organization Logo (Optional)">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoInputChange}
                          className="cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </Field>
                    </div>

                    <div className="border-b border-border/60 pb-5 pt-6">
                      <h3 className="font-display text-2xl text-foreground">Section 2. Type of Record Attempt</h3>
                      <p className="text-xs text-muted-foreground mt-1">Specify if attempt is individual or a team roster.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => update("orgAttemptType", "individual")}
                        className={cn(
                          "p-4 border rounded text-left transition-colors",
                          form.orgAttemptType === "individual" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                        )}
                      >
                        <span className="font-bold text-xs uppercase block mb-1">Individual attempt</span>
                        <span className="text-[10px] text-muted-foreground">Attempt submitted on behalf of one single archer.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => update("orgAttemptType", "team")}
                        className={cn(
                          "p-4 border rounded text-left transition-colors",
                          form.orgAttemptType === "team" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                        )}
                      >
                        <span className="font-bold text-xs uppercase block mb-1">Team / Group attempt</span>
                        <span className="text-[10px] text-muted-foreground">Attempt by a synchronized roster of up to 5 archers.</span>
                      </button>
                    </div>

                    {form.orgAttemptType === "individual" ? (
                      /* Section 3A: Individual applicant details */
                      <div className="space-y-6 pt-6 border-t border-border/40">
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wide">Section 3A. Individual Applicant Details</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <Field label="Full Legal Name *">
                            <Input value={form.orgIndName} onChange={(e) => update("orgIndName", e.target.value)} placeholder="Archer legal name" required />
                          </Field>
                          <Field label="Date of Birth *">
                            <Input type="date" value={form.orgIndDob} onChange={(e) => update("orgIndDob", e.target.value)} required />
                          </Field>
                          <Field label="Gender *">
                            <Select value={form.orgIndGender} onValueChange={(v) => update("orgIndGender", v)}>
                              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="Nationality *">
                            <Input value={form.orgIndNationality} onChange={(e) => update("orgIndNationality", e.target.value)} placeholder="Country" />
                          </Field>
                          <Field label="Age Category *">
                            <Select value={form.orgIndAgeCategory} onValueChange={(v) => update("orgIndAgeCategory", v)}>
                              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Veteran">Veteran</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="Discipline *">
                            <Select value={form.orgIndDiscipline} onValueChange={(v) => update("orgIndDiscipline", v)}>
                              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Recurve">Recurve</SelectItem>
                                <SelectItem value="Compound">Compound</SelectItem>
                                <SelectItem value="Traditional">Traditional</SelectItem>
                                <SelectItem value="Para-archery">Para-archery</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="Bow Type *">
                            <Input value={form.orgIndBowType} onChange={(e) => update("orgIndBowType", e.target.value)} placeholder="e.g. Recurve Bow" required />
                          </Field>
                        </div>
                      </div>
                    ) : (
                      /* Section 3B: Team / group roster */
                      <div className="space-y-6 pt-6 border-t border-border/40">
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wide">Section 3B. Team / Group Roster (Up to 5 Members)</h4>
                        <div className="space-y-6">
                          {[0, 1, 2, 3, 4].map((index) => (
                            <div key={index} className="border border-border/40 p-4 rounded-md space-y-4 bg-card/30">
                              <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Member #{index + 1} {index === 0 && " (Minimum Requirement)"}</span>
                              <div className="grid md:grid-cols-2 gap-4 text-xs">
                                <Field label="Full Name *">
                                  <Input
                                    value={form.teamRoster[index]?.fullName || ""}
                                    onChange={(e) => updateTeamMember(index, "fullName", e.target.value)}
                                    placeholder="Archer full name"
                                    required={index === 0}
                                  />
                                </Field>
                                <Field label="Role *">
                                  <Select
                                    value={form.teamRoster[index]?.role || "Shooter"}
                                    onValueChange={(v) => updateTeamMember(index, "role", v)}
                                  >
                                    <SelectTrigger className="text-[11px] h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Shooter">Shooter</SelectItem>
                                      <SelectItem value="Captain">Captain</SelectItem>
                                      <SelectItem value="Alternate">Alternate</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </Field>
                                <Field label="Age Category">
                                  <Select
                                    value={form.teamRoster[index]?.ageCategory || "Senior"}
                                    onValueChange={(v) => updateTeamMember(index, "ageCategory", v)}
                                  >
                                    <SelectTrigger className="text-[11px] h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Junior">Junior</SelectItem>
                                      <SelectItem value="Senior">Senior</SelectItem>
                                      <SelectItem value="Veteran">Veteran</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </Field>
                                <Field label="Discipline">
                                  <Select
                                    value={form.teamRoster[index]?.discipline || "Recurve"}
                                    onValueChange={(v) => updateTeamMember(index, "discipline", v)}
                                  >
                                    <SelectTrigger className="text-[11px] h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Recurve">Recurve</SelectItem>
                                      <SelectItem value="Compound">Compound</SelectItem>
                                      <SelectItem value="Traditional">Traditional</SelectItem>
                                      <SelectItem value="Para-archery">Para-archery</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </Field>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* STEP 2: ATTEMPT DETAILS */}
            {step === 2 && (
              <div className="space-y-8 animate-scale-in">
                <div className="border-b border-border/60 pb-5">
                  <h3 className="font-display text-2xl text-foreground">Section 3. Record Attempt Details</h3>
                  <p className="text-xs text-muted-foreground mt-1">Specify target parameters and setup details.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Record Category Being Attempted *">
                    <Select value={form.recordCategory} onValueChange={(v) => update("recordCategory", v)}>
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Proposed Record Title / Goal *">
                    <Input value={form.recordTitle} onChange={(e) => update("recordTitle", e.target.value)} placeholder="e.g. Most bullseyes at 70 meters in 3 minutes" required />
                  </Field>
                  <Field label="Target Distance (e.g. 50 meters, 70 meters) *">
                    <Input value={form.targetDistance} onChange={(e) => update("targetDistance", e.target.value)} placeholder="Distance" required />
                  </Field>
                  <Field label={form.formType === "claim" ? "Official Date of Attempt *" : "Intended Date of Attempt *"}>
                    <Input type="date" value={form.attemptDate} onChange={(e) => update("attemptDate", e.target.value)} required />
                  </Field>
                  <Field label="Venue & Location *">
                    <Input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Venue range name, City, Country" required />
                  </Field>
                  <Field label="Existing Record Being Challenged (If any)">
                    <Input value={form.existingRecord} onChange={(e) => update("existingRecord", e.target.value)} placeholder="Title / Holder Name" />
                  </Field>
                  <Field label="Current Record Value (If any)">
                    <Input value={form.currentRecordValue} onChange={(e) => update("currentRecordValue", e.target.value)} placeholder="e.g. 29 hits" />
                  </Field>
                  <Field label="Officiating Body / Judges Present *">
                    <Input value={form.officiatingBody} onChange={(e) => update("officiatingBody", e.target.value)} placeholder="e.g. World Archery Judges Panel" required />
                  </Field>
                  <Field label="Number of Witnesses *">
                    <Input type="number" value={form.witnessCount} onChange={(e) => update("witnessCount", e.target.value)} placeholder="e.g. 3" required />
                  </Field>
                  <Field label="Equipment / Device Details (Bow model, draw weight, target face, timing devices) *">
                    <Input value={form.equipmentDetails} onChange={(e) => update("equipmentDetails", e.target.value)} placeholder="Equipment specs used for validation" required />
                  </Field>
                </div>

                {form.formType === "claim" && (
                  <div className="space-y-6 pt-6 border-t border-border/40">
                    <h4 className="font-semibold text-sm text-primary uppercase tracking-wide">Section 4. Completed Attempt details</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="Measured / Achieved Score / Value *">
                        <Input value={form.achievedResult} onChange={(e) => update("achievedResult", e.target.value)} placeholder="e.g. 48 accurate hits" required />
                      </Field>
                    </div>
                  </div>
                )}

                <Field label="Detailed Description of Method & Layout Details">
                  <Textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Provide full description of targets layout, verification framework, arrow specifications, and attempt flow..."
                  />
                </Field>
              </div>
            )}

            {/* STEP 3: EVIDENCE & APPROVALS */}
            {step === 3 && (
              <div className="space-y-8 animate-scale-in">
                {form.formType === "claim" && (
                  /* EVIDENCE SECTION (CLAIM ONLY) */
                  <>
                    <div className="border-b border-border/60 pb-5">
                      <h3 className="font-display text-2xl text-foreground">Section 4. Evidence of Attempt</h3>
                      <p className="text-xs text-muted-foreground mt-1">Check all supporting evidence payloads being supplied.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: "evidenceVideo", label: "Video Evidence Attached" },
                        { key: "evidencePhoto", label: "Photo Evidence Attached" },
                        { key: "evidenceScorecard", label: "Official Scorecards Attached" },
                        { key: "evidenceWitness", label: "Witness Statements Attached" },
                        { key: "evidenceEquipment", label: "Equipment Certification" },
                        { key: "evidenceThirdParty", label: "Third-party Verification" }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-3 p-3 border border-border/60 rounded-md bg-card/30 hover:bg-muted/40 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form[item.key as keyof ApplyForm] as boolean}
                            onChange={(e) => update(item.key as keyof ApplyForm, e.target.checked)}
                            className="h-4 w-4 border-border text-primary focus:ring-primary rounded"
                          />
                          <span className="text-xs font-semibold text-foreground/80">{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                      <Field label="Description of Video / Photo Evidence (File names, source, timestamps)">
                        <Textarea
                          value={form.evidenceDescription}
                          onChange={(e) => update("evidenceDescription", e.target.value)}
                          placeholder="e.g. video1.mp4 - GoPro camera 1 - 0:00 to 3:00"
                          rows={3}
                        />
                      </Field>
                      <div className="space-y-4">
                        <Field label="Third-party Verification Body (If any)">
                          <Input value={form.thirdPartyBody} onChange={(e) => update("thirdPartyBody", e.target.value)} placeholder="e.g. World Archery Committee" />
                        </Field>
                        <Field label="Verification Reference / Certificate No.">
                          <Input value={form.thirdPartyRef} onChange={(e) => update("thirdPartyRef", e.target.value)} placeholder="e.g. WA-10023" />
                        </Field>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-b border-border/60 pb-5 pt-4">
                  <h3 className="font-display text-2xl text-foreground">Section 5 & 6. Approvals & Endorsements</h3>
                  <p className="text-xs text-muted-foreground mt-1">Specify regulatory signatures and guardian approval nodes.</p>
                </div>

                <div className="space-y-6">
                  {/* Parent guardian approval */}
                  <div className="border border-border/40 p-5 rounded-md bg-card/30 space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-primary">Section 5. Parent / Legal Guardian Approval (Mandatory for Junior)</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <Field label="Parent / Guardian Full Name">
                        <Input value={form.parentName} onChange={(e) => update("parentName", e.target.value)} placeholder="Guardian Name" />
                      </Field>
                      <Field label="Relationship to Applicant">
                        <Input value={form.parentRelationship} onChange={(e) => update("parentRelationship", e.target.value)} placeholder="Relationship" />
                      </Field>
                      <Field label="Contact Phone Number">
                        <Input value={form.parentPhone} onChange={(e) => update("parentPhone", e.target.value)} placeholder="Phone" />
                      </Field>
                      <Field label="Contact Email Address">
                        <Input type="email" value={form.parentEmail} onChange={(e) => update("parentEmail", e.target.value)} placeholder="Email" />
                      </Field>
                    </div>
                  </div>

                  {/* School institution approval */}
                  <div className="border border-border/40 p-5 rounded-md bg-card/30 space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-primary">Section 6. School / Institution Approval (Mandatory)</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <Field label="Institution / School Name">
                        <Input value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)} placeholder="School/Academy Name" />
                      </Field>
                      <Field label="Institution Registration / ID Number">
                        <Input value={form.schoolRegId} onChange={(e) => update("schoolRegId", e.target.value)} placeholder="Registration ID" />
                      </Field>
                      <Field label="Authorized Official Name">
                        <Input value={form.schoolOfficialName} onChange={(e) => update("schoolOfficialName", e.target.value)} placeholder="Official Name" />
                      </Field>
                      <Field label="Designation / Title">
                        <Input value={form.schoolOfficialDesignation} onChange={(e) => update("schoolOfficialDesignation", e.target.value)} placeholder="e.g. Principal / Director" />
                      </Field>
                    </div>
                  </div>

                  {/* Claim approval / witness validation */}
                  {form.formType === "claim" && (
                    <div className="border border-border/40 p-5 rounded-md bg-card/30 space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-primary">Section 7. Witness or Coach Approval</h4>
                      <div className="grid gap-4 text-xs">
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="witnessApprovalType"
                              checked={form.witnessApprovalType === "witness"}
                              onChange={() => update("witnessApprovalType", "witness")}
                              className="text-primary focus:ring-primary"
                            />
                            <span>Independent Witness present at attempt</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="witnessApprovalType"
                              checked={form.witnessApprovalType === "coach"}
                              onChange={() => update("witnessApprovalType", "coach")}
                              className="text-primary focus:ring-primary"
                            />
                            <span>Coach who supervised / trained claimant</span>
                          </label>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Field label="Approver Full Name *">
                            <Input value={form.witnessApproverName} onChange={(e) => update("witnessApproverName", e.target.value)} placeholder="Full Name" />
                          </Field>
                          <Field label="Relationship / Role *">
                            <Input value={form.witnessApproverRelationship} onChange={(e) => update("witnessApproverRelationship", e.target.value)} placeholder="e.g. Certified Witness / Range Coach" />
                          </Field>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Organisation specific reps */}
                  {(form.category === "organization" || form.category === "corporate") && (
                    <div className="border border-border/40 p-5 rounded-md bg-card/30 space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-primary">Section 5 & 6. Organization/Corporate Representative Details</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <Field label="Organization/Corporate Authorised Rep Name *">
                          <Input value={form.orgRepName} onChange={(e) => update("orgRepName", e.target.value)} placeholder="Rep Name" />
                        </Field>
                        <Field label="Rep Designation / Title *">
                          <Input value={form.orgRepDesignation} onChange={(e) => update("orgRepDesignation", e.target.value)} placeholder="Rep Designation" />
                        </Field>
                        <Field label="Witnessing Official Name *">
                          <Input value={form.orgWitnessName} onChange={(e) => update("orgWitnessName", e.target.value)} placeholder="Witness Name" />
                        </Field>
                        <Field label="Witnessing Official Designation / Role *">
                          <Input value={form.orgWitnessDesignation} onChange={(e) => update("orgWitnessDesignation", e.target.value)} placeholder="Witness Designation" />
                        </Field>
                      </div>
                    </div>
                  )}
                </div>

                {/* Final declarations check */}
                <div className="bg-muted/30 p-6 rounded-lg space-y-4 border border-border/40">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-primary border-b border-border/40 pb-2">Final Summary & Verification Snapshot</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-xs md:text-sm">
                    <span className="text-muted-foreground">Action Type:</span>
                    <span className="font-medium text-right capitalize">{form.formType}</span>

                    <span className="text-muted-foreground">Category Mode:</span>
                    <span className="font-medium text-right capitalize">{form.category} {(form.category === "organization" || form.category === "corporate") && `(${form.orgAttemptType})`}</span>

                    <span className="text-muted-foreground">Applicant Entity:</span>
                    <span className="font-medium text-right truncate">
                      {form.category === "individual" ? form.name : form.orgName}
                    </span>

                    <span className="text-muted-foreground">Proposed Record:</span>
                    <span className="font-medium text-right truncate">{form.recordTitle}</span>

                    <span className="text-muted-foreground">Target Distance:</span>
                    <span className="font-medium text-right">{form.targetDistance}</span>

                    <span className="text-muted-foreground">Attempt Venue:</span>
                    <span className="font-medium text-right truncate">{form.venue}</span>
                  </div>
                  <div className="relative border border-primary/20 bg-primary/5 p-4 rounded text-[11px] text-muted-foreground leading-relaxed text-justify mt-4">
                    <strong>Declaration:</strong> I declare that the information and evidence provided in this attempt submission are true, accurate, and complete to the best of my knowledge. Approval is subject to full verification rules of the Archery Book of World Records.
                  </div>
                  <div className="flex items-start gap-2.5 mt-4 p-4 border border-border/60 bg-muted/20 rounded-md">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 accent-primary rounded cursor-pointer"
                    />
                    <label htmlFor="acceptTerms" className="text-xs text-muted-foreground leading-relaxed select-none cursor-pointer text-justify">
                      {form.formType === "application" ? (
                        <span>
                          <strong>Terms & Conditions (Application):</strong> I accept the general rules of the Archery Book of World Records. I agree that this record attempt application is subject to safety, ethical, and verification criteria (including the presence of at least 2 independent witnesses), and that the ABWR committee holds sole authority over final record validation.
                        </span>
                      ) : (
                        <span>
                          <strong>Terms & Conditions (Claim):</strong> I accept the claim submission guidelines of the Archery Book of World Records. I certify that this record attempt has been completed in full compliance with the guidelines, signed off by at least 2 independent witnesses, and all uploaded media, photo, and scorecard evidence is authentic and untampered.
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Controls */}
            <div className="flex justify-between mt-10 pt-6 border-t border-border/60">
              <Button variant="ghost" onClick={back} disabled={step === 0}>
                <ChevronLeft size={16} /> Back
              </Button>
              {step < stepLabels.length - 1 ? (
                <Button variant="hero" onClick={next}>Next <ChevronRight size={16} /></Button>
              ) : (
                <Button variant="hero" onClick={submit} disabled={!acceptTerms}>
                  Submit {formTypeName}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</Label>
    {children}
  </div>
);

export default Apply;
