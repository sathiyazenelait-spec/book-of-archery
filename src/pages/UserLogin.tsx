import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  UserPlus, 
  LogOut, 
  FileText, 
  Activity, 
  CheckCircle2, 
  X, 
  Award, 
  Plus,
  ShieldAlert,
  Download
} from "lucide-react";
import { downloadSubmissionPdf } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { 
  getMySubmissionsApi, 
  deleteSubmissionApi,
  StoredSubmission 
} from "@/data/records";
import { cn } from "@/lib/utils";

const UserLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Registration form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Member dashboard states
  const [submissionsList, setSubmissionsList] = useState<StoredSubmission[]>([]);
  const [viewingSubmission, setViewingSubmission] = useState<StoredSubmission | null>(null);

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

  const loadData = async (token: string) => {
    try {
      const data = await getMySubmissionsApi(token);
      setSubmissionsList(data);
    } catch (e) {
      toast.error("Failed to load your submission history.");
    }
  };

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = () => {
      const session = sessionStorage.getItem("abwr_admin_is_logged_in");
      const token = sessionStorage.getItem("abwr_admin_token");
      if (session === "true" && token) {
        setIsLoggedIn(true);
        loadData(token);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setIsLoggedIn(true);
        sessionStorage.setItem("abwr_admin_token", data.token);
        sessionStorage.setItem("abwr_admin_is_logged_in", "true");
        toast.success(`Welcome back, ${data.user.username}`);
        loadData(data.token);
        
        // Redirect standard user to homepage
        window.location.href = "/";
      } else {
        toast.error(data.error || "Invalid username or password");
      }
    } catch (err) {
      toast.error("Failed to connect to backend server.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      toast.error("Please fill in all registration fields.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: regUsername.trim(), 
          email: regEmail.trim(), 
          password: regPassword.trim() 
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account registered successfully! Please log in.");
        setIsRegistering(false);
        setUsername(regUsername); // prefill in login form
        setPassword("");
        setRegUsername("");
        setRegEmail("");
        setRegPassword("");
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (err) {
      toast.error("Failed to connect to backend server.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("abwr_admin_is_logged_in");
    sessionStorage.removeItem("abwr_admin_token");
    setUsername("");
    setPassword("");
    setSubmissionsList([]);
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const handleDeleteSubmission = async (id: string) => {
    if (confirm("Are you sure you want to cancel and delete this submission?")) {
      const token = sessionStorage.getItem("abwr_admin_token") || "";
      const success = await deleteSubmissionApi(id, token);
      if (success) {
        setSubmissionsList(submissionsList.filter(s => s.id !== id));
        setViewingSubmission(null);
        toast.success("Submission successfully deleted.");
      } else {
        toast.error("Failed to delete submission.");
      }
    }
  };

  // Render Member Dashboard if logged in
  if (isLoggedIn) {
    const totalClaims = submissionsList.length;
    const pendingClaims = submissionsList.filter(s => s.status === "pending").length;
    const approvedClaims = submissionsList.filter(s => s.status === "approved").length;
    const rejectedClaims = submissionsList.filter(s => s.status === "rejected").length;

    return (
      <>
        <PageHeader
          eyebrow="Member Dashboard"
          title={<>My <em className="text-gradient-gold not-italic">Account</em></>}
          description="Track the verification progress of your archery record applications and official claims."
        />

        <section className="container pb-32">
          <div className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">
                Session Active: Member ({currentUser?.username})
              </span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 hover:text-red-500">
              <LogOut size={14} /> Log Out
            </Button>
          </div>

          <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <FileText className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Claims</span>
                <div className="font-display text-3xl text-foreground font-bold">{totalClaims}</div>
              </div>
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <Activity className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending Review</span>
                <div className="font-display text-3xl text-yellow-400 font-bold">{pendingClaims}</div>
              </div>
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <CheckCircle2 className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Approved / Certified</span>
                <div className="font-display text-3xl text-emerald-400 font-bold">{approvedClaims}</div>
              </div>
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <X className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Rejected</span>
                <div className="font-display text-3xl text-red-400 font-bold">{rejectedClaims}</div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-border/60 bg-card p-8 rounded-lg space-y-6">
                <h4 className="font-display text-2xl">New Submission</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="heroOutline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                    <Link to="/apply?type=application">
                      <Plus size={18} /> Apply for Record
                    </Link>
                  </Button>
                  <Button asChild variant="heroOutline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                    <Link to="/apply?type=claim">
                      <Award size={18} /> Submit Claim
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="border border-border/60 bg-card p-8 rounded-lg flex flex-col justify-center space-y-4">
                <h4 className="font-display text-2xl flex items-center gap-2 text-primary">
                  <ShieldAlert size={20} /> Member Portal Authority
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                  Welcome to your personalized portal. You can view the real-time processing status of your world record attempts. Our official adjudicators evaluate the credentials manually.
                </p>
              </div>
            </div>

            {/* MY CLAIMS TABLE */}
            <div className="space-y-4">
              <h3 className="font-display text-2xl">My Submission History</h3>
              {submissionsList.length === 0 ? (
                <div className="border border-dashed border-border/60 p-12 text-center text-muted-foreground rounded-lg">
                  You have not submitted any world record applications or claims yet.
                </div>
              ) : (
                <div className="border border-border/60 rounded-lg overflow-x-auto bg-card/40">
                  <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                        <th className="p-4">ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Proposed Record Title</th>
                        <th className="p-4">Venue</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {submissionsList.map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 font-bold text-foreground">{sub.id}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                              sub.formType === "application" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                            )}>
                              {sub.formType}
                            </span>
                          </td>
                          <td className="p-4 capitalize">{sub.category}</td>
                          <td className="p-4 max-w-[200px] truncate">{sub.recordTitle}</td>
                          <td className="p-4 max-w-[150px] truncate">{sub.venue}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                              sub.status === "pending" && "bg-yellow-500/10 text-yellow-400",
                              sub.status === "approved" && "bg-emerald-500/10 text-emerald-400",
                              sub.status === "rejected" && "bg-red-500/10 text-red-400"
                            )}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setViewingSubmission(sub)} 
                                title="View Details"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                              >
                                <Eye size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => downloadSubmissionPdf(sub)} 
                                title="Download Form PDF"
                                className="h-8 w-8 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                              >
                                <Download size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DETAILS OVERLAY */}
        {viewingSubmission && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-card w-full max-w-2xl border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="sm" onClick={() => setViewingSubmission(null)} className="h-8 w-8 p-0">
                  <X size={16} />
                </Button>
              </div>

              <div className="border-b border-border/40 pb-4">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                  viewingSubmission.formType === "application" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                )}>
                  {viewingSubmission.formType} Form
                </span>
                <h3 className="font-display text-2xl mt-3">{viewingSubmission.recordTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">Reference: {viewingSubmission.id} · Registered: {new Date(viewingSubmission.submittedAt).toLocaleString()}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-xs md:text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Applicant Details ({viewingSubmission.category})</h4>
                    <p className="font-semibold text-foreground">
                      {viewingSubmission.name || viewingSubmission.orgName || viewingSubmission.companyName}
                    </p>
                    {viewingSubmission.dob && <p className="text-xs text-muted-foreground mt-0.5">DOB: {viewingSubmission.dob}</p>}
                    {viewingSubmission.orgType && <p className="text-xs text-muted-foreground mt-0.5">Type: {viewingSubmission.orgType}</p>}
                    {viewingSubmission.repName && <p className="text-xs text-muted-foreground mt-0.5">Representative: {viewingSubmission.repName}</p>}
                    {viewingSubmission.companyReg && <p className="text-xs text-muted-foreground mt-0.5">Reg: {viewingSubmission.companyReg}</p>}
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Contact Point</h4>
                    <p className="text-foreground">{viewingSubmission.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{viewingSubmission.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Logistics & Venue</h4>
                    <p className="text-foreground">{viewingSubmission.venue}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Date: {viewingSubmission.attemptDate}</p>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Score / Achieved Result</h4>
                    <p className="text-lg font-bold text-primary">{viewingSubmission.achievedResult || "Pending attempt"}</p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2 border-t border-border/40 pt-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Attempt Description</h4>
                  <p className="text-xs leading-relaxed text-justify text-muted-foreground">{viewingSubmission.description}</p>
                </div>

                {viewingSubmission.witnessInfo && (
                  <div className="md:col-span-2 space-y-2 border-t border-border/40 pt-4">
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Witness Details</h4>
                    <p className="text-xs leading-relaxed text-justify text-muted-foreground">{viewingSubmission.witnessInfo}</p>
                  </div>
                )}

                {viewingSubmission.formData && (
                  <div className="md:col-span-2 space-y-4 border-t border-border/40 pt-4 text-xs">
                    <h4 className="text-[10px] uppercase tracking-wider text-primary font-mono font-bold">Full PDF Registration Details</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-muted/40 p-4 rounded border border-border/40 max-h-60 overflow-y-auto">
                      {viewingSubmission.category === "individual" ? (
                        <>
                          <span className="text-muted-foreground">Gender / Nationality:</span>
                          <span>{viewingSubmission.formData.gender} / {viewingSubmission.formData.nationality}</span>
                          <span className="text-muted-foreground">Age Class:</span>
                          <span>{viewingSubmission.formData.ageCategory}</span>
                          <span className="text-muted-foreground">Discipline / Bow Type:</span>
                          <span>{viewingSubmission.formData.discipline} / {viewingSubmission.formData.bowType}</span>
                          <span className="text-muted-foreground">Academy / Club Affiliation:</span>
                          <span>{viewingSubmission.formData.clubAffiliation}</span>
                          <span className="text-muted-foreground">Address:</span>
                          <span>{viewingSubmission.formData.address}, {viewingSubmission.formData.city}, {viewingSubmission.formData.state} {viewingSubmission.formData.postalCode}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground">Entity ID / Name:</span>
                          <span>{viewingSubmission.formData.orgRegNumber} / {viewingSubmission.formData.orgName}</span>
                          <span className="text-muted-foreground">Entity Type / Country:</span>
                          <span>{viewingSubmission.formData.orgType} / {viewingSubmission.formData.orgCountry}</span>
                          <span className="text-muted-foreground">Rep / Title:</span>
                          <span>{viewingSubmission.formData.orgContactPerson} ({viewingSubmission.formData.orgContactDesignation})</span>
                          <span className="text-muted-foreground">Rep Contact:</span>
                          <span>{viewingSubmission.formData.orgContactEmail} / {viewingSubmission.formData.orgContactPhone}</span>
                          <span className="text-muted-foreground">Attempt Model:</span>
                          <span className="capitalize">{viewingSubmission.formData.orgAttemptType} Attempt</span>
                          {viewingSubmission.formData.orgAttemptType === "individual" ? (
                            <>
                              <span className="text-muted-foreground">Section 3A Archer:</span>
                              <span>{viewingSubmission.formData.orgIndName} (DoB: {viewingSubmission.formData.orgIndDob})</span>
                              <span className="text-muted-foreground">Archer Profile:</span>
                              <span>{viewingSubmission.formData.orgIndDiscipline} / {viewingSubmission.formData.orgIndBowType}</span>
                            </>
                          ) : (
                            <div className="col-span-2 space-y-2 pt-2 border-t border-border/20">
                              <span className="font-bold text-[10px] text-muted-foreground uppercase block">Section 3B Team Roster:</span>
                              <ol className="list-decimal pl-4 space-y-1">
                                {viewingSubmission.formData.teamRoster?.filter((m: any) => m.fullName).map((m: any, idx: number) => (
                                  <li key={idx}>
                                    {m.fullName} - {m.role} ({m.ageCategory}, {m.discipline})
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </>
                      )}

                      <span className="text-muted-foreground border-t border-border/20 pt-2 col-span-2 font-bold text-[10px] uppercase">Attempt Specifications</span>
                      <span className="text-muted-foreground">Target Distance:</span>
                      <span>{viewingSubmission.formData.targetDistance}</span>
                      <span className="text-muted-foreground">Officiating Body:</span>
                      <span>{viewingSubmission.formData.officiatingBody}</span>
                      <span className="text-muted-foreground">Witnesses / Judges:</span>
                      <span>{viewingSubmission.formData.witnessCount}</span>
                      <span className="text-muted-foreground">Equipment / Devices:</span>
                      <span>{viewingSubmission.formData.equipmentDetails}</span>

                      {viewingSubmission.formData.parentName && (
                        <>
                          <span className="text-muted-foreground border-t border-border/20 pt-2 col-span-2 font-bold text-[10px] uppercase">Parent/Guardian Approval</span>
                          <span className="text-muted-foreground">Guardian Name:</span>
                          <span>{viewingSubmission.formData.parentName} ({viewingSubmission.formData.parentRelationship})</span>
                          <span className="text-muted-foreground">Guardian Contact:</span>
                          <span>{viewingSubmission.formData.parentPhone} / {viewingSubmission.formData.parentEmail}</span>
                        </>
                      )}
                      {viewingSubmission.formData.schoolName && (
                        <>
                          <span className="text-muted-foreground border-t border-border/20 pt-2 col-span-2 font-bold text-[10px] uppercase">School/Institution Endorsement</span>
                          <span className="text-muted-foreground">School / Reg ID:</span>
                          <span>{viewingSubmission.formData.schoolName} ({viewingSubmission.formData.schoolRegId})</span>
                          <span className="text-muted-foreground">Authorized Official:</span>
                          <span>{viewingSubmission.formData.schoolOfficialName} ({viewingSubmission.formData.schoolOfficialDesignation})</span>
                        </>
                      )}

                      {viewingSubmission.formType === "claim" && (
                        <>
                          <span className="text-muted-foreground border-t border-border/20 pt-2 col-span-2 font-bold text-[10px] uppercase">Claim Evidences Checklist</span>
                          <span className="text-muted-foreground">Attached Files:</span>
                          <span>
                            {[
                              viewingSubmission.formData.evidenceVideo && "Video",
                              viewingSubmission.formData.evidencePhoto && "Photo",
                              viewingSubmission.formData.evidenceScorecard && "Scorecards",
                              viewingSubmission.formData.evidenceWitness && "Witness-Sheets",
                              viewingSubmission.formData.evidenceEquipment && "Equip-Cert",
                              viewingSubmission.formData.evidenceThirdParty && "Third-Party"
                            ].filter(Boolean).join(", ") || "None"}
                          </span>
                          {viewingSubmission.formData.evidenceDescription && (
                            <>
                              <span className="text-muted-foreground">Evidence Description:</span>
                              <span className="whitespace-pre-line">{viewingSubmission.formData.evidenceDescription}</span>
                            </>
                          )}
                          {viewingSubmission.formData.witnessApproverName && (
                            <>
                              <span className="text-muted-foreground">Approver / Relationship:</span>
                              <span>{viewingSubmission.formData.witnessApproverName} ({viewingSubmission.formData.witnessApproverRelationship})</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
                {viewingSubmission.status === "pending" && (
                  <Button onClick={() => handleDeleteSubmission(viewingSubmission.id)} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 uppercase text-xs font-mono mr-auto">
                    Cancel & Delete
                  </Button>
                )}
                <Button 
                  onClick={() => downloadSubmissionPdf(viewingSubmission)} 
                  variant="heroOutline" 
                  size="sm" 
                  className="border-amber-500/60 text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5"
                >
                  <Download size={14} /> Download Form PDF
                </Button>
                <Button onClick={() => setViewingSubmission(null)} variant="heroOutline" size="sm">Close</Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Member Portal"
        title={isRegistering 
          ? <>User <em className="text-gradient-gold not-italic">Registration</em></>
          : <>User <em className="text-gradient-gold not-italic">Sign In</em></>
        }
        description={isRegistering 
          ? "Create a member account to submit world record claims, track statuses, and customize forms."
          : "Sign in to your member account to submit record applications and verify credentials."
        }
      />

      <section className="container pb-32">
        <div className="max-w-md mx-auto bg-card/60 backdrop-blur-md border border-border/60 p-8 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-gold" />
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            {isRegistering ? <UserPlus className="text-primary" size={20} /> : <Lock className="text-primary" size={20} />}
          </div>

          <h3 className="font-display text-2xl text-center mb-6 text-foreground">
            {isRegistering ? "Create Account" : "Sign In"}
          </h3>

          {isRegistering ? (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Username *</Label>
                <Input 
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="bg-background border-border/60 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email Address *</Label>
                <Input 
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="bg-background border-border/60 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password *</Label>
                <Input 
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-background border-border/60 focus-visible:ring-primary/40"
                />
              </div>

              <Button type="submit" variant="hero" className="w-full mt-2">
                Register Account
              </Button>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(false)} 
                  className="text-xs text-primary hover:underline font-mono"
                >
                  Already have an account? Sign in here
                </button>
              </div>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Username</Label>
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="bg-background border-border/60 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-background border-border/60 focus-visible:ring-primary/40 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-mono font-bold"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full mt-2">
                Sign In
              </Button>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(true)} 
                  className="text-xs text-primary hover:underline font-mono"
                >
                  Don't have an account? Register here
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default UserLogin;
