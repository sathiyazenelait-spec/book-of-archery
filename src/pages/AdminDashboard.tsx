import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { 
  getRecordsApi, 
  saveRecordApi, 
  deleteRecordApi,
  getSubmissionsApi, 
  updateSubmissionStatusApi, 
  deleteSubmissionApi, 
  getContactsApi, 
  updateContactStatusApi, 
  deleteContactApi, 
  getUsersApi, 
  saveUserApi, 
  deleteUserApi,
  ContactQuery,
  UserItem,
  RecordCategory, 
  RecordItem, 
  StoredSubmission,
  categories,
  getStatsApi,
  saveStatApi,
  deleteStatApi,
  HomepageStat,
  getTestimonialsApi,
  saveTestimonialApi,
  deleteTestimonialApi,
  Testimonial,
  API_URL
} from "@/data/records";
import { 
  Trophy, 
  FileText, 
  Award, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Lock, 
  LogOut, 
  Search, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  EyeOff, 
  CheckCircle2,
  MessageSquare,
  Mail,
  UserPlus,
  Download
} from "lucide-react";
import { downloadSubmissionPdf } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock images list
import record1 from "@/assets/record-1.jpg";
import record2 from "@/assets/record-2.jpg";
import record3 from "@/assets/record-3.jpg";
import record4 from "@/assets/record-4.jpg";
import record5 from "@/assets/record-5.jpg";
import record6 from "@/assets/record-6.jpg";

const imageOptions = [
  { name: "Kyoto Range (Recurve)", value: record1 },
  { name: "Atacama Desert (Sunset)", value: record2 },
  { name: "Stockholm Junior Target", value: record3 },
  { name: "Lagos Caliper Cluster", value: record4 },
  { name: "Telavi Mounted Heritage", value: record5 },
  { name: "Cusco Ceremonial Bows", value: record6 }
];

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Data States
  const [recordsList, setRecordsList] = useState<RecordItem[]>([]);
  const [submissionsList, setSubmissionsList] = useState<StoredSubmission[]>([]);
  const [contactsList, setContactsList] = useState<ContactQuery[]>([]);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [statsList, setStatsList] = useState<HomepageStat[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  
  const [activeTab, setActiveTab] = useState("overview");

  // Filtering / Search States
  const [recordsSearch, setRecordsSearch] = useState("");
  const [recordsCategoryFilter, setRecordsCategoryFilter] = useState<string>("All");
  const [submissionsTypeFilter, setSubmissionsTypeFilter] = useState<string>("All");
  const [submissionsStatusFilter, setSubmissionsStatusFilter] = useState<string>("All");
  const [contactsStatusFilter, setContactsStatusFilter] = useState<string>("All");

  // Detail Modal States
  const [viewingSubmission, setViewingSubmission] = useState<StoredSubmission | null>(null);
  const [approvingClaimRecord, setApprovingClaimRecord] = useState<StoredSubmission | null>(null);
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);
  const [addingRecord, setAddingRecord] = useState(false);
  
  // User Modal/Form States
  const [addingUser, setAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("user");

  // Dialog & Form edit states for Stats
  const [editingStat, setEditingStat] = useState<HomepageStat | null>(null);
  const [isStatFormOpen, setIsStatFormOpen] = useState(false);
  const [statValue, setStatValue] = useState<number>(0);
  const [statSuffix, setStatSuffix] = useState("");
  const [statLabel, setStatLabel] = useState("");

  // Dialog & Form edit states for Testimonials
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialTitle, setTestimonialTitle] = useState("");

  // Record Form States (For Add/Edit)
  const [formRecordId, setFormRecordId] = useState("");
  const [formRecordTitle, setFormRecordTitle] = useState("");
  const [formRecordParticipant, setFormRecordParticipant] = useState("");
  const [formRecordCategory, setFormRecordCategory] = useState<RecordCategory>("Archery Performance Records");
  const [formRecordDate, setFormRecordDate] = useState("");
  const [formRecordLocation, setFormRecordLocation] = useState("");
  const [formRecordImage, setFormRecordImage] = useState(record1);
  const [formRecordCustomImageUrl, setFormRecordCustomImageUrl] = useState("");
  const [formRecordMetric, setFormRecordMetric] = useState("");
  const [formRecordShortDesc, setFormRecordShortDesc] = useState("");
  const [formRecordDescription, setFormRecordDescription] = useState("");

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
  const isAdminSession = currentUser && currentUser.role === "admin";

  const getCurrentUserId = () => {
    if (!currentUser) return null;
    return currentUser.id;
  };

  const loadData = async (token: string) => {
    try {
      const recordsData = await getRecordsApi();
      setRecordsList(recordsData);
      
      const parsed = getParsedToken();
      if (parsed && parsed.role === "admin") {
        const submissionsData = await getSubmissionsApi(token);
        setSubmissionsList(submissionsData);

        const contactsData = await getContactsApi(token);
        setContactsList(contactsData);

        const usersData = await getUsersApi(token);
        setUsersList(usersData);

        const statsData = await getStatsApi();
        setStatsList(statsData);

        const testimonialsData = await getTestimonialsApi();
        setTestimonialsList(testimonialsData);
      }
    } catch (e) {
      toast.error("Failed to load dashboard parameters.");
    }
  };

  // Check session state on load
  useEffect(() => {
    const checkAuth = async () => {
      const session = sessionStorage.getItem("abwr_admin_is_logged_in");
      const token = sessionStorage.getItem("abwr_admin_token");
      if (session === "true" && token) {
        setIsLoggedIn(true);
        loadData(token);
      } else {
        const recordsData = await getRecordsApi();
        setRecordsList(recordsData);
      }
    };
    checkAuth();
  }, []);

  // ================= STATS ACTIONS =================
  const handleOpenStatForm = (stat: HomepageStat | null = null) => {
    if (stat) {
      setEditingStat(stat);
      setStatValue(stat.value);
      setStatSuffix(stat.suffix);
      setStatLabel(stat.label);
    } else {
      setEditingStat(null);
      setStatValue(0);
      setStatSuffix("");
      setStatLabel("");
    }
    setIsStatFormOpen(true);
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const statData: HomepageStat = {
      id: editingStat?.id,
      value: statValue,
      suffix: statSuffix,
      label: statLabel
    };

    const isEdit = !!editingStat;
    const success = await saveStatApi(statData, isEdit, token);

    if (success) {
      toast.success(isEdit ? "Stat updated successfully." : "Stat created successfully.");
      setIsStatFormOpen(false);
      // Reload stats list
      const updated = await getStatsApi();
      setStatsList(updated);
    } else {
      toast.error("Failed to save stat.");
    }
  };

  const handleDeleteStat = async (id: number) => {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const success = await deleteStatApi(id, token);

    if (success) {
      toast.success("Stat deleted successfully.");
      const updated = await getStatsApi();
      setStatsList(updated);
    } else {
      toast.error("Failed to delete stat.");
    }
  };

  // ================= TESTIMONIALS ACTIONS =================
  const handleOpenTestimonialForm = (testimonial: Testimonial | null = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setTestimonialQuote(testimonial.quote);
      setTestimonialName(testimonial.name);
      setTestimonialTitle(testimonial.title);
    } else {
      setEditingTestimonial(null);
      setTestimonialQuote("");
      setTestimonialName("");
      setTestimonialTitle("");
    }
    setIsTestimonialFormOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const testimonialData: Testimonial = {
      id: editingTestimonial?.id,
      quote: testimonialQuote,
      name: testimonialName,
      title: testimonialTitle
    };

    const isEdit = !!editingTestimonial;
    const success = await saveTestimonialApi(testimonialData, isEdit, token);

    if (success) {
      toast.success(isEdit ? "Testimonial updated successfully." : "Testimonial created successfully.");
      setIsTestimonialFormOpen(false);
      // Reload testimonials list
      const updated = await getTestimonialsApi();
      setTestimonialsList(updated);
    } else {
      toast.error("Failed to save testimonial.");
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const success = await deleteTestimonialApi(id, token);

    if (success) {
      toast.success("Testimonial deleted successfully.");
      const updated = await getTestimonialsApi();
      setTestimonialsList(updated);
    } else {
      toast.error("Failed to delete testimonial.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // Enforce administrator-only restriction on /admin route
        if (data.user.role !== "admin") {
          toast.error("Access Denied: Standard members cannot sign in here. Please use the User Login page.");
          return;
        }

        setIsLoggedIn(true);
        sessionStorage.setItem("abwr_admin_token", data.token);
        sessionStorage.setItem("abwr_admin_is_logged_in", "true");
        setActiveTab("overview");
        toast.success(`Welcome back, ${data.user.username}`);
        loadData(data.token);
      } else {
        toast.error(data.error || "Invalid administrator credentials");
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
    setContactsList([]);
    setUsersList([]);
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  // Submission actions
  const handleApproveApplication = async (sub: StoredSubmission) => {
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const success = await updateSubmissionStatusApi(sub.id, "approved", token);
    if (success) {
      const updated = submissionsList.map(s => s.id === sub.id ? { ...s, status: "approved" as const } : s);
      setSubmissionsList(updated);
      if (viewingSubmission?.id === sub.id) {
        setViewingSubmission({ ...viewingSubmission, status: "approved" });
      }
      toast.success(`Application ${sub.id} acknowledged successfully!`);
    } else {
      toast.error("Failed to approve application on database.");
    }
  };

  const handleOpenApproveClaim = (sub: StoredSubmission) => {
    setApprovingClaimRecord(sub);
    
    // Autofill record form fields with claim details
    setFormRecordId(`ABWR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
    setFormRecordTitle(sub.recordTitle);
    
    let participantName = sub.name;
    if (sub.category === "organization") participantName = sub.orgName;
    if (sub.category === "corporate") participantName = sub.companyName;
    setFormRecordParticipant(participantName);
    
    setFormRecordCategory(sub.recordCategory as RecordCategory);
    setFormRecordDate(sub.attemptDate);
    setFormRecordLocation(sub.venue);
    setFormRecordMetric(sub.achievedResult);
    setFormRecordShortDesc(`Verified record set by ${participantName}.`);
    setFormRecordDescription(sub.description);
    setFormRecordImage(record1);
    setFormRecordCustomImageUrl("");
  };

  const handleApproveClaimConfirm = async () => {
    if (!formRecordTitle.trim() || !formRecordParticipant.trim() || !formRecordLocation.trim() || !formRecordMetric.trim() || !formRecordDescription.trim()) {
      toast.error("Please fill in all required record details.");
      return;
    }

    const finalImage = formRecordCustomImageUrl.trim() || formRecordImage;

    const newRecord: RecordItem = {
      id: formRecordId || `ABWR-REC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      title: formRecordTitle,
      participant: formRecordParticipant,
      category: formRecordCategory,
      date: formRecordDate ? new Date(formRecordDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A",
      location: formRecordLocation,
      image: finalImage,
      shortDescription: formRecordShortDesc,
      description: formRecordDescription,
      metric: formRecordMetric,
      gallery: [finalImage, record4, record2]
    };

    const token = sessionStorage.getItem("abwr_admin_token") || "";

    // Save record to DB
    const saveSuccess = await saveRecordApi(newRecord, false, token);
    if (!saveSuccess) {
      toast.error("Failed to add new record to database.");
      return;
    }

    // Update submission status
    if (approvingClaimRecord) {
      const statusSuccess = await updateSubmissionStatusApi(approvingClaimRecord.id, "approved", token);
      if (statusSuccess) {
        const updatedSubs = submissionsList.map(s => s.id === approvingClaimRecord.id ? { ...s, status: "approved" as const } : s);
        setSubmissionsList(updatedSubs);
        if (viewingSubmission?.id === approvingClaimRecord.id) {
          setViewingSubmission({ ...viewingSubmission, status: "approved" });
        }
      }
    }

    const updatedRecords = [newRecord, ...recordsList];
    setRecordsList(updatedRecords);
    setApprovingClaimRecord(null);
    toast.success("Claim approved and new official record certified!");
  };

  const handleRejectSubmission = async (sub: StoredSubmission) => {
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const success = await updateSubmissionStatusApi(sub.id, "rejected", token);
    if (success) {
      const updated = submissionsList.map(s => s.id === sub.id ? { ...s, status: "rejected" as const } : s);
      setSubmissionsList(updated);
      if (viewingSubmission?.id === sub.id) {
        setViewingSubmission({ ...viewingSubmission, status: "rejected" });
      }
      toast.success(`Submission ${sub.id} marked as rejected.`);
    } else {
      toast.error("Failed to reject submission on database.");
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (confirm("Are you sure you want to delete this submission history?")) {
      const token = sessionStorage.getItem("abwr_admin_token") || "";
      const success = await deleteSubmissionApi(id, token);
      if (success) {
        const updated = submissionsList.filter(s => s.id !== id);
        setSubmissionsList(updated);
        setViewingSubmission(null);
        toast.success("Submission history deleted.");
      } else {
        toast.error("Failed to delete submission from database.");
      }
    }
  };

  // CRUD Record operations
  const handleOpenAddRecord = () => {
    setAddingRecord(true);
    setFormRecordId(`ABWR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
    setFormRecordTitle("");
    setFormRecordParticipant("");
    setFormRecordCategory("Archery Performance Records");
    setFormRecordDate("");
    setFormRecordLocation("");
    setFormRecordMetric("");
    setFormRecordShortDesc("");
    setFormRecordDescription("");
    setFormRecordImage(record1);
    setFormRecordCustomImageUrl("");
  };

  const handleAddRecordConfirm = async () => {
    if (!formRecordTitle.trim() || !formRecordParticipant.trim() || !formRecordLocation.trim() || !formRecordMetric.trim() || !formRecordDescription.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const finalImage = formRecordCustomImageUrl.trim() || formRecordImage;

    const newRecord: RecordItem = {
      id: formRecordId || `ABWR-REC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      title: formRecordTitle,
      participant: formRecordParticipant,
      category: formRecordCategory,
      date: formRecordDate ? new Date(formRecordDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A",
      location: formRecordLocation,
      image: finalImage,
      shortDescription: formRecordShortDesc || "Certified official archery record.",
      description: formRecordDescription,
      metric: formRecordMetric,
      gallery: [finalImage, record4, record2]
    };

    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const success = await saveRecordApi(newRecord, false, token);
    if (success) {
      const updatedRecords = [newRecord, ...recordsList];
      setRecordsList(updatedRecords);
      setAddingRecord(false);
      toast.success("New official record added to the registry!");
    } else {
      toast.error("Failed to add new record to database.");
    }
  };

  const handleOpenEditRecord = (rec: RecordItem) => {
    setEditingRecord(rec);
    setFormRecordId(rec.id);
    setFormRecordTitle(rec.title);
    setFormRecordParticipant(rec.participant);
    setFormRecordCategory(rec.category);
    
    let formattedDate = "";
    try {
      const parsed = Date.parse(rec.date);
      if (!isNaN(parsed)) {
        formattedDate = new Date(parsed).toISOString().split("T")[0];
      }
    } catch (e) {}
    
    setFormRecordDate(formattedDate);
    setFormRecordLocation(rec.location);
    setFormRecordMetric(rec.metric);
    setFormRecordShortDesc(rec.shortDescription);
    setFormRecordDescription(rec.description);
    if (imageOptions.some(opt => opt.value === rec.image)) {
      setFormRecordImage(rec.image);
      setFormRecordCustomImageUrl("");
    } else {
      setFormRecordImage(record1);
      setFormRecordCustomImageUrl(rec.image);
    }
  };

  const handleEditRecordConfirm = async () => {
    if (!editingRecord) return;
    if (!formRecordTitle.trim() || !formRecordParticipant.trim() || !formRecordLocation.trim() || !formRecordMetric.trim() || !formRecordDescription.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const finalImage = formRecordCustomImageUrl.trim() || formRecordImage;

    const updatedRecord: RecordItem = {
      ...editingRecord,
      title: formRecordTitle,
      participant: formRecordParticipant,
      category: formRecordCategory,
      date: formRecordDate ? new Date(formRecordDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : editingRecord.date,
      location: formRecordLocation,
      image: finalImage,
      shortDescription: formRecordShortDesc,
      description: formRecordDescription,
      metric: formRecordMetric,
      gallery: [finalImage, ...(editingRecord.gallery.slice(1))]
    };

    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const success = await saveRecordApi(updatedRecord, true, token);
    if (success) {
      const updatedRecords = recordsList.map(r => r.id === editingRecord.id ? updatedRecord : r);
      setRecordsList(updatedRecords);
      setEditingRecord(null);
      toast.success("Record updated successfully!");
    } else {
      toast.error("Failed to update record in database.");
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this record from the official registry?")) {
      const token = sessionStorage.getItem("abwr_admin_token") || "";
      const success = await deleteRecordApi(id, token);
      if (success) {
        const updated = recordsList.filter(r => r.id !== id);
        setRecordsList(updated);
        toast.success("Record deleted from registry.");
      } else {
        toast.error("Failed to delete record from database.");
      }
    }
  };

  // Contacts Handlers
  const handleToggleContactRead = async (contact: ContactQuery) => {
    if (!contact.id) return;
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const newStatus = contact.status === "read" ? "unread" : "read";
    const success = await updateContactStatusApi(contact.id, newStatus, token);
    if (success) {
      const updated = contactsList.map(c => c.id === contact.id ? { ...c, status: newStatus as "read" | "unread" } : c);
      setContactsList(updated);
      toast.success(`Message marked as ${newStatus}`);
    } else {
      toast.error("Failed to update message status.");
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm("Are you sure you want to delete this contact query?")) {
      const token = sessionStorage.getItem("abwr_admin_token") || "";
      const success = await deleteContactApi(id, token);
      if (success) {
        setContactsList(contactsList.filter(c => c.id !== id));
        toast.success("Contact query message deleted.");
      } else {
        toast.error("Failed to delete contact query.");
      }
    }
  };

  // User Administration Handlers
  const handleOpenAddUser = () => {
    setAddingUser(true);
    setFormUsername("");
    setFormPassword("");
    setFormRole("user");
  };

  const handleAddUserConfirm = async () => {
    if (!formUsername.trim() || !formPassword.trim()) {
      toast.error("Username and password are required.");
      return;
    }
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const newUser: UserItem = { username: formUsername, password: formPassword, role: formRole };
    const success = await saveUserApi(newUser, false, token);
    if (success) {
      setAddingUser(false);
      const data = await getUsersApi(token);
      setUsersList(data);
      toast.success("New user account created successfully.");
    } else {
      toast.error("Failed to create user. Verify that username is unique.");
    }
  };

  const handleOpenEditUser = (user: UserItem) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormPassword("");
    setFormRole(user.role);
  };

  const handleEditUserConfirm = async () => {
    if (!editingUser) return;
    if (!formUsername.trim()) {
      toast.error("Username is required.");
      return;
    }
    const token = sessionStorage.getItem("abwr_admin_token") || "";
    const updatedUser: UserItem = { id: editingUser.id, username: formUsername, role: formRole };
    if (formPassword.trim() !== "") {
      updatedUser.password = formPassword;
    }
    
    const success = await saveUserApi(updatedUser, true, token);
    if (success) {
      setEditingUser(null);
      const data = await getUsersApi(token);
      setUsersList(data);
      toast.success("User details updated successfully.");
    } else {
      toast.error("Failed to update user parameters.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    const activeUserId = getCurrentUserId();
    if (activeUserId && id === activeUserId) {
      toast.error("You cannot delete your own session account.");
      return;
    }
    if (confirm("Are you sure you want to permanently delete this user account?")) {
      const token = sessionStorage.getItem("abwr_admin_token") || "";
      const success = await deleteUserApi(id, token);
      if (success) {
        setUsersList(usersList.filter(u => u.id !== id));
        toast.success("User account deleted.");
      } else {
        toast.error("Failed to delete user account.");
      }
    }
  };

  // Filter lists
  const filteredSubmissions = submissionsList.filter(sub => {
    const matchType = submissionsTypeFilter === "All" || sub.formType === submissionsTypeFilter.toLowerCase();
    const matchStatus = submissionsStatusFilter === "All" || sub.status === submissionsStatusFilter.toLowerCase();
    return matchType && matchStatus;
  });

  const filteredRecords = recordsList.filter(rec => {
    const q = recordsSearch.trim().toLowerCase();
    const matchSearch = !q || rec.title.toLowerCase().includes(q) || rec.participant.toLowerCase().includes(q) || rec.location.toLowerCase().includes(q);
    const matchCat = recordsCategoryFilter === "All" || rec.category === recordsCategoryFilter;
    return matchSearch && matchCat;
  });

  const filteredContacts = contactsList.filter(con => {
    if (contactsStatusFilter === "All") return true;
    return con.status === contactsStatusFilter.toLowerCase();
  });

  // Overview calculations
  const totalRecords = recordsList.length;
  const pendingApps = submissionsList.filter(s => s.formType === "application" && s.status === "pending").length;
  const pendingClaims = submissionsList.filter(s => s.formType === "claim" && s.status === "pending").length;
  const unreadContacts = contactsList.filter(c => c.status === "unread").length;

  if (!isLoggedIn || !isAdminSession) {
    return (
      <>
        <PageHeader
          eyebrow="Access Denied"
          title={<>Restricted <em className="text-gradient-gold not-italic">Area</em></>}
          description="Administrative privileges are required to view the Control Dashboard."
        />
        <section className="container pb-32 flex flex-col items-center justify-center space-y-6">
          <div className="max-w-md text-center bg-card/65 backdrop-blur-md border border-border/60 p-8 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-red-500" />
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="text-red-500" size={20} />
            </div>
            <h3 className="font-display text-xl mb-3 text-foreground">Admin Access Required</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              You must log in to the administrative portal to manage world record registries.
            </p>
            <Button asChild variant="hero" className="w-full">
              <Link to="/login/admin">Go to Administrator Sign In</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Administrator View"
        title={<>Control <em className="text-gradient-gold not-italic">Dashboard</em></>}
        description="Verify submitted record evidences, adjudicate applicant claim states, and configure active archery registry entries."
      />

      <section className="container pb-32">
        <div className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">
              Session Active: Adjudicator Connection
            </span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 hover:text-red-500">
            <LogOut size={14} /> Log Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto space-y-8">
          <div className="flex justify-center md:justify-start">
            <TabsList className="bg-card border border-border/60 p-1 h-auto rounded-lg flex flex-wrap gap-1 w-full max-w-4xl justify-center md:justify-start">
              <TabsTrigger value="overview" className="rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-mono py-2 px-3">Overview</TabsTrigger>
              <TabsTrigger value="submissions" className="rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-mono py-2 px-3">
                Claims ({submissionsList.filter(s=>s.status==="pending").length})
              </TabsTrigger>
              <TabsTrigger value="records" className="rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-mono py-2 px-3">Registry ({recordsList.length})</TabsTrigger>
              <TabsTrigger value="contacts" className="rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-mono py-2 px-3">Inbox ({unreadContacts})</TabsTrigger>
              <TabsTrigger value="users" className="rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-mono py-2 px-3">Users</TabsTrigger>
              <TabsTrigger value="stats" className="rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-mono py-2 px-3">Stats ({statsList.length})</TabsTrigger>
              <TabsTrigger value="testimonials" className="rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-mono py-2 px-3">Testimonials ({testimonialsList.length})</TabsTrigger>
            </TabsList>
          </div>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <Trophy className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Certified</span>
                <div className="font-display text-3xl text-gradient-gold font-bold">{totalRecords}</div>
              </div>
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <FileText className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Applications</span>
                <div className="font-display text-3xl text-primary font-bold">{pendingApps}</div>
              </div>
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <Award className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Claims</span>
                <div className="font-display text-3xl text-primary font-bold">{pendingClaims}</div>
              </div>
              <div className="border border-border/60 bg-card p-6 rounded-lg space-y-2 relative overflow-hidden">
                <MessageSquare className="absolute right-4 bottom-4 h-12 w-12 text-primary/10" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Unread Queries</span>
                <div className="font-display text-3xl text-foreground font-bold">{unreadContacts}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Quick actions panel */}
              <div className="border border-border/60 bg-card p-8 rounded-lg space-y-6">
                <h4 className="font-display text-2xl">Quick Tasks</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => { setActiveTab("records"); handleOpenAddRecord(); }} variant="heroOutline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                    <Plus size={18} /> Add New Record
                  </Button>
                  <Button onClick={() => { setActiveTab("submissions"); setSubmissionsTypeFilter("Claim"); setSubmissionsStatusFilter("Pending"); }} variant="heroOutline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                    <Award size={18} /> Review Claims ({pendingClaims})
                  </Button>
                </div>
              </div>

              {/* Status callout panel */}
              <div className="border border-border/60 bg-card p-8 rounded-lg flex flex-col justify-center space-y-4">
                <h4 className="font-display text-2xl flex items-center gap-2 text-primary">
                  <ShieldAlert size={20} /> DB Adjudication Authority
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                  This session is securely connected to the backend relational database. All record approvals, user details, and query modifications are stored securely in MySQL server.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* SUBMISSIONS MANAGEMENT TAB */}
          <TabsContent value="submissions" className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h3 className="font-display text-2xl">Pending submissions queue</h3>
              <div className="flex flex-wrap gap-3">
                <Select value={submissionsTypeFilter} onValueChange={setSubmissionsTypeFilter}>
                  <SelectTrigger className="w-[140px] text-xs h-9 bg-card border-border/60"><SelectValue placeholder="Form Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Application">Applications</SelectItem>
                    <SelectItem value="Claim">Claims</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={submissionsStatusFilter} onValueChange={setSubmissionsStatusFilter}>
                  <SelectTrigger className="w-[140px] text-xs h-9 bg-card border-border/60"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="border border-dashed border-border/60 p-12 text-center text-muted-foreground rounded-lg">
                No submissions found matching your filters.
              </div>
            ) : (
              <div className="border border-border/60 rounded-lg overflow-x-auto bg-card/40">
                <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Applicant Name</th>
                      <th className="p-4">Proposed Record Title</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredSubmissions.map((sub) => (
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
                        <td className="p-4 max-w-[150px] truncate">{sub.name || sub.orgName || sub.companyName}</td>
                        <td className="p-4 max-w-[200px] truncate">{sub.recordTitle}</td>
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
                        <td className="p-4">
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
                            
                            {sub.status === "pending" && (
                              <>
                                {sub.formType === "claim" ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleOpenApproveClaim(sub)} 
                                    title="Approve & Add to Registry"
                                    className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                  >
                                    <CheckCircle2 size={14} />
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleApproveApplication(sub)} 
                                    title="Acknowledge Application"
                                    className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                  >
                                    <Check size={14} />
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRejectSubmission(sub)} 
                                  title="Reject Submission"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <X size={14} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* RECORDS LIST MANAGEMENT TAB */}
          <TabsContent value="records" className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input 
                  value={recordsSearch}
                  onChange={(e) => setRecordsSearch(e.target.value)}
                  placeholder="Search records or archers"
                  className="pl-9 bg-card border-border/60 focus-visible:ring-primary/40 text-sm h-9"
                />
              </div>

              <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
                <Select value={recordsCategoryFilter} onValueChange={setRecordsCategoryFilter}>
                  <SelectTrigger className="w-[180px] text-xs h-9 bg-card border-border/60"><SelectValue placeholder="Category Filter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={handleOpenAddRecord} variant="hero" size="sm" className="h-9 font-mono uppercase tracking-wider text-xs">
                  <Plus size={14} className="mr-1" /> Add New
                </Button>
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="border border-dashed border-border/60 p-12 text-center text-muted-foreground rounded-lg">
                No registry records found matching your filters.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredRecords.map((rec) => (
                  <div key={rec.id} className="border border-border/60 bg-card p-6 rounded-lg flex gap-5 items-start justify-between relative group hover:border-primary/45 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-20 h-16 border border-border/60 overflow-hidden shrink-0">
                        <img src={rec.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-mono leading-none mb-1.5">{rec.id}</div>
                        <h4 className="font-display text-lg font-bold leading-tight line-clamp-1">{rec.title}</h4>
                        <div className="text-xs text-primary font-mono mt-1">{rec.metric}</div>
                        <div className="text-[11px] text-muted-foreground mt-1.5 line-clamp-1">{rec.participant} · {rec.location.split(",")[0]}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenEditRecord(rec)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* CONTACT QUERIES TAB */}
          <TabsContent value="contacts" className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h3 className="font-display text-2xl">Inbox Messages</h3>
              <Select value={contactsStatusFilter} onValueChange={setContactsStatusFilter}>
                <SelectTrigger className="w-[140px] text-xs h-9 bg-card border-border/60"><SelectValue placeholder="Status Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Queries</SelectItem>
                  <SelectItem value="Unread">Unread</SelectItem>
                  <SelectItem value="Read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="border border-dashed border-border/60 p-12 text-center text-muted-foreground rounded-lg">
                No contact messages found matching this query state.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContacts.map((con) => (
                  <div 
                    key={con.id} 
                    className={cn(
                      "border p-6 rounded-lg flex flex-col md:flex-row md:items-start justify-between gap-5 relative transition-colors",
                      con.status === "unread" ? "border-primary bg-primary/5" : "border-border/60 bg-card"
                    )}
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-lg font-bold text-foreground">{con.name}</span>
                        <a href={`mailto:${con.email}`} className="text-xs text-primary hover:underline font-mono flex items-center gap-1">
                          <Mail size={12} /> {con.email}
                        </a>
                        {con.status === "unread" && (
                          <span className="px-2 py-0.5 rounded text-[8px] bg-primary text-primary-foreground font-bold tracking-wider uppercase">NEW</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line text-justify">{con.message}</p>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Received: {con.created_at ? new Date(con.created_at).toLocaleString() : "Date N/A"}
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 justify-end">
                      <Button
                        variant="heroOutline"
                        size="sm"
                        onClick={() => handleToggleContactRead(con)}
                        className="text-xs font-mono uppercase h-8"
                      >
                        {con.status === "read" ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => con.id && handleDeleteContact(con.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-mono h-8 flex gap-1 items-center"
                      >
                        <Trash2 size={12} /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* USER MANAGEMENT TAB */}
          <TabsContent value="users" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-2xl font-bold">User Accounts</h3>
              <Button onClick={handleOpenAddUser} variant="hero" size="sm" className="h-9 font-mono uppercase tracking-wider text-xs">
                <UserPlus size={14} className="mr-1" /> Add Account
              </Button>
            </div>

            <div className="border border-border/60 rounded-lg overflow-x-auto bg-card/40">
              <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">System Role</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {usersList.filter(user => user.role !== "admin").map((user) => (
                    <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-foreground">{user.id}</td>
                      <td className="p-4 font-semibold">{user.username}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                          user.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-muted text-muted-foreground"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenEditUser(user)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => user.id && handleDeleteUser(user.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* HOMEPAGE STATS TAB */}
          <TabsContent value="stats" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-2xl font-bold">Homepage Statistics</h3>
              <Button onClick={() => handleOpenStatForm(null)} variant="hero" size="sm" className="h-9 font-mono uppercase tracking-wider text-xs">
                <Plus size={14} className="mr-1" /> Add New Stat
              </Button>
            </div>

            <div className="border border-border/60 rounded-lg overflow-x-auto bg-card/40">
              <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="p-4">Stat ID</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">Suffix</th>
                    <th className="p-4">Label</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {statsList.map((stat) => (
                    <tr key={stat.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-foreground">{stat.id}</td>
                      <td className="p-4 font-semibold text-primary text-lg">{stat.value.toLocaleString()}</td>
                      <td className="p-4 font-semibold text-muted-foreground">{stat.suffix || "None"}</td>
                      <td className="p-4 text-foreground">{stat.label}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenStatForm(stat)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => stat.id && handleDeleteStat(stat.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TESTIMONIALS TAB */}
          <TabsContent value="testimonials" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-2xl font-bold">Member Testimonials</h3>
              <Button onClick={() => handleOpenTestimonialForm(null)} variant="hero" size="sm" className="h-9 font-mono uppercase tracking-wider text-xs">
                <Plus size={14} className="mr-1" /> Add Testimonial
              </Button>
            </div>

            <div className="border border-border/60 rounded-lg overflow-x-auto bg-card/40">
              <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Quote</th>
                    <th className="p-4">Author Name</th>
                    <th className="p-4">Title / Context</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {testimonialsList.map((test) => (
                    <tr key={test.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-foreground">{test.id}</td>
                      <td className="p-4 text-muted-foreground max-w-sm truncate">"{test.quote}"</td>
                      <td className="p-4 font-semibold text-foreground">{test.name}</td>
                      <td className="p-4 text-foreground">{test.title}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenTestimonialForm(test)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => test.id && handleDeleteTestimonial(test.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* OVERLAY 1: VIEW SUBMISSION MODAL */}
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
              <Button onClick={() => handleDeleteSubmission(viewingSubmission.id)} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 uppercase text-xs font-mono mr-auto">
                Delete History
              </Button>

              <div className="flex gap-2">
                <Button 
                  onClick={() => downloadSubmissionPdf(viewingSubmission)} 
                  variant="heroOutline" 
                  size="sm" 
                  className="border-amber-500/60 text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5"
                >
                  <Download size={14} /> Download Form PDF
                </Button>
                <Button onClick={() => setViewingSubmission(null)} variant="heroOutline" size="sm">Close</Button>
                {viewingSubmission.status === "pending" && (
                  <>
                    <Button onClick={() => handleRejectSubmission(viewingSubmission)} variant="heroOutline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/10">Reject</Button>
                    {viewingSubmission.formType === "claim" ? (
                      <Button onClick={() => { setViewingSubmission(null); handleOpenApproveClaim(viewingSubmission); }} variant="hero" size="sm">Approve & Certify</Button>
                    ) : (
                      <Button onClick={() => handleApproveApplication(viewingSubmission)} variant="hero" size="sm">Acknowledge</Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: CERTIFY RECORD MODAL */}
      {approvingClaimRecord && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card w-full max-w-2xl border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setApprovingClaimRecord(null)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            <h3 className="font-display text-2xl border-b border-border/40 pb-3">Adjudicate & Certify Record</h3>

            <div className="grid md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Registry Certificate ID</Label>
                <Input value={formRecordId} onChange={(e) => setFormRecordId(e.target.value)} className="bg-background border-border/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Record Title *</Label>
                <Input value={formRecordTitle} onChange={(e) => setFormRecordTitle(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Certified Record Holder *</Label>
                <Input value={formRecordParticipant} onChange={(e) => setFormRecordParticipant(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Registry Category *</Label>
                <Select value={formRecordCategory} onValueChange={(v) => setFormRecordCategory(v as RecordCategory)}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Attempt Date *</Label>
                <Input type="date" value={formRecordDate} onChange={(e) => setFormRecordDate(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Venue / Location *</Label>
                <Input value={formRecordLocation} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-primary uppercase font-bold font-mono text-[10px]">Achieved Metric / Score *</Label>
                <Input value={formRecordMetric} onChange={(e) => setFormRecordMetric(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Short Lead Description</Label>
                <Input value={formRecordShortDesc} onChange={(e) => setFormRecordShortDesc(e.target.value)} className="bg-background border-border/60" />
              </div>

              {/* Image selectors */}
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Gallery Image Preset</Label>
                <Select value={formRecordImage} onValueChange={setFormRecordImage}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {imageOptions.map((opt) => <SelectItem key={opt.name} value={opt.value}>{opt.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Or Custom Image URL</Label>
                <Input value={formRecordCustomImageUrl} onChange={(e) => setFormRecordCustomImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="bg-background border-border/60 font-mono text-xs" />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Full Certified Description *</Label>
                <Textarea rows={4} value={formRecordDescription} onChange={(e) => setFormRecordDescription(e.target.value)} className="bg-background border-border/60 text-xs" required />
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
              <Button onClick={() => setApprovingClaimRecord(null)} variant="heroOutline" size="sm">Cancel</Button>
              <Button onClick={handleApproveClaimConfirm} variant="hero" size="sm">Add to Registry & Approve</Button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 3: MANUALLY ADD RECORD MODAL */}
      {addingRecord && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card w-full max-w-2xl border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setAddingRecord(false)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            <h3 className="font-display text-2xl border-b border-border/40 pb-3">Create Registry Record</h3>

            <div className="grid md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Record Registry ID</Label>
                <Input value={formRecordId} onChange={(e) => setFormRecordId(e.target.value)} className="bg-background border-border/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Record Title *</Label>
                <Input value={formRecordTitle} onChange={(e) => setFormRecordTitle(e.target.value)} placeholder="e.g. Most bullseyes in 60s" className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Certified Record Holder *</Label>
                <Input value={formRecordParticipant} onChange={(e) => setFormRecordParticipant(e.target.value)} placeholder="Archer's Full Name" className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Registry Category *</Label>
                <Select value={formRecordCategory} onValueChange={(v) => setFormRecordCategory(v as RecordCategory)}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Attempt Date *</Label>
                <Input type="date" value={formRecordDate} onChange={(e) => setFormRecordDate(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Venue / Location *</Label>
                <Input value={formRecordLocation} placeholder="City, Country" className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-primary uppercase font-bold font-mono text-[10px]">Achieved Metric / Score *</Label>
                <Input value={formRecordMetric} onChange={(e) => setFormRecordMetric(e.target.value)} placeholder="e.g. 47 bullseyes" className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Short Lead Description</Label>
                <Input value={formRecordShortDesc} onChange={(e) => setFormRecordShortDesc(e.target.value)} placeholder="Lead summary for the registry gallery" className="bg-background border-border/60" />
              </div>

              {/* Image selectors */}
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Gallery Image Preset</Label>
                <Select value={formRecordImage} onValueChange={setFormRecordImage}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {imageOptions.map((opt) => <SelectItem key={opt.name} value={opt.value}>{opt.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Or Custom Image URL</Label>
                <Input value={formRecordCustomImageUrl} onChange={(e) => setFormRecordCustomImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="bg-background border-border/60 font-mono text-xs" />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Full Certified Description *</Label>
                <Textarea rows={4} value={formRecordDescription} onChange={(e) => setFormRecordDescription(e.target.value)} placeholder="Complete details of the event attempt methodology and verification..." className="bg-background border-border/60 text-xs" required />
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
              <Button onClick={() => setAddingRecord(false)} variant="heroOutline" size="sm">Cancel</Button>
              <Button onClick={handleAddRecordConfirm} variant="hero" size="sm">Save to Registry</Button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 4: MANUALLY EDIT RECORD MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card w-full max-w-2xl border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setEditingRecord(null)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            <h3 className="font-display text-2xl border-b border-border/40 pb-3">Edit Registry Record</h3>

            <div className="grid md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Record Registry ID</Label>
                <Input value={formRecordId} disabled className="bg-background border-border/40 cursor-not-allowed text-muted-foreground font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Record Title *</Label>
                <Input value={formRecordTitle} onChange={(e) => setFormRecordTitle(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Certified Record Holder *</Label>
                <Input value={formRecordParticipant} onChange={(e) => setFormRecordParticipant(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Registry Category *</Label>
                <Select value={formRecordCategory} onValueChange={(v) => setFormRecordCategory(v as RecordCategory)}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Attempt Date *</Label>
                <Input type="date" value={formRecordDate} onChange={(e) => setFormRecordDate(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Venue / Location *</Label>
                <Input value={formRecordLocation} onChange={(e) => setFormRecordLocation(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-primary uppercase font-bold font-mono text-[10px]">Achieved Metric / Score *</Label>
                <Input value={formRecordMetric} onChange={(e) => setFormRecordMetric(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Short Lead Description</Label>
                <Input value={formRecordShortDesc} onChange={(e) => setFormRecordShortDesc(e.target.value)} className="bg-background border-border/60" />
              </div>

              {/* Image selectors */}
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Gallery Image Preset</Label>
                <Select value={formRecordImage} onValueChange={setFormRecordImage}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {imageOptions.map((opt) => <SelectItem key={opt.name} value={opt.value}>{opt.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Or Custom Image URL</Label>
                <Input value={formRecordCustomImageUrl} onChange={(e) => setFormRecordCustomImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="bg-background border-border/60 font-mono text-xs" />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Full Certified Description *</Label>
                <Textarea rows={4} value={formRecordDescription} className="bg-background border-border/60 text-xs" required />
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
              <Button onClick={() => setEditingRecord(null)} variant="heroOutline" size="sm">Cancel</Button>
              <Button onClick={handleEditRecordConfirm} variant="hero" size="sm">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 5: USER CREATE MODAL */}
      {addingUser && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setAddingUser(false)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            <h3 className="font-display text-2xl border-b border-border/40 pb-3">Create System Account</h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Username *</Label>
                <Input value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="Enter username" className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Passcode / Password *</Label>
                <Input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="••••••••" className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">User Role *</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
              <Button onClick={() => setAddingUser(false)} variant="heroOutline" size="sm">Cancel</Button>
              <Button onClick={handleAddUserConfirm} variant="hero" size="sm">Create Account</Button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 6: USER EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            <h3 className="font-display text-2xl border-b border-border/40 pb-3">Edit System Account</h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Username *</Label>
                <Input value={formUsername} onChange={(e) => setFormUsername(e.target.value)} className="bg-background border-border/60" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">New Passcode (Leave blank to keep current)</Label>
                <Input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="••••••••" className="bg-background border-border/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">User Role *</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger className="bg-background border-border/60 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
              <Button onClick={() => setEditingUser(null)} variant="heroOutline" size="sm">Cancel</Button>
              <Button onClick={handleEditUserConfirm} variant="hero" size="sm">Save Parameters</Button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 7: HOMEPAGE STAT FORM MODAL */}
      {isStatFormOpen && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setIsStatFormOpen(false)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            <h3 className="font-display text-2xl border-b border-border/40 pb-3">
              {editingStat ? "Edit Homepage Stat" : "Add Homepage Stat"}
            </h3>

            <form onSubmit={handleSaveStat} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Value *</Label>
                <Input 
                  type="number" 
                  value={statValue} 
                  onChange={(e) => setStatValue(parseInt(e.target.value) || 0)} 
                  placeholder="e.g. 120" 
                  className="bg-background border-border/60" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Suffix</Label>
                <Input 
                  value={statSuffix} 
                  onChange={(e) => setStatSuffix(e.target.value)} 
                  placeholder="e.g. +, yrs" 
                  className="bg-background border-border/60" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Label / Description *</Label>
                <Input 
                  value={statLabel} 
                  onChange={(e) => setStatLabel(e.target.value)} 
                  placeholder="e.g. Verified Records" 
                  className="bg-background border-border/60" 
                  required 
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
                <Button type="button" onClick={() => setIsStatFormOpen(false)} variant="heroOutline" size="sm">Cancel</Button>
                <Button type="submit" variant="hero" size="sm">Save Stat</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY 8: TESTIMONIAL FORM MODAL */}
      {isTestimonialFormOpen && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md border border-border/60 p-8 rounded-lg shadow-2xl space-y-6 relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setIsTestimonialFormOpen(false)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>

            <h3 className="font-display text-2xl border-b border-border/40 pb-3">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h3>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Member Name *</Label>
                <Input 
                  value={testimonialName} 
                  onChange={(e) => setTestimonialName(e.target.value)} 
                  placeholder="e.g. Aiyana Vance" 
                  className="bg-background border-border/60" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Title / Context *</Label>
                <Input 
                  value={testimonialTitle} 
                  onChange={(e) => setTestimonialTitle(e.target.value)} 
                  placeholder="e.g. Record Holder · Kyoto, Japan" 
                  className="bg-background border-border/60" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground uppercase font-mono text-[10px]">Quote *</Label>
                <Textarea 
                  rows={4}
                  value={testimonialQuote} 
                  onChange={(e) => setTestimonialQuote(e.target.value)} 
                  placeholder="Enter the quote statement" 
                  className="bg-background border-border/60" 
                  required 
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-border/60 pt-4">
                <Button type="button" onClick={() => setIsTestimonialFormOpen(false)} variant="heroOutline" size="sm">Cancel</Button>
                <Button type="submit" variant="hero" size="sm">Save Testimonial</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
