import record1 from "@/assets/record-1.jpg";
import record2 from "@/assets/record-2.jpg";
import record3 from "@/assets/record-3.jpg";
import record4 from "@/assets/record-4.jpg";
import record5 from "@/assets/record-5.jpg";
import record6 from "@/assets/record-6.jpg";

export type RecordCategory =
  | "Archery Performance Records"
  | "Distance Records"
  | "Speed Records"
  | "Endurance Records"
  | "Accuracy Records"
  | "Traditional Archery Records"
  | "Horseback Archery Records"
  | "Youth Records"
  | "School Records"
  | "College & University Records"
  | "Team Records"
  | "Corporate Records"
  | "Mass Participation Records"
  | "Innovation Records"
  | "Para-Archery Records"
  | "Coaching Records"
  | "Open Record Category";

export interface RecordItem {
  id: string;
  title: string;
  participant: string;
  category: RecordCategory;
  date: string;
  location: string;
  image: string;
  shortDescription: string;
  description: string;
  metric: string;
  gallery: string[];
}

export const records: RecordItem[] = [
  {
    id: "ABWR-2025-001",
    title: "Most Bullseyes in 60 Seconds",
    participant: "Aiyana Vance",
    category: "Accuracy Records",
    date: "March 14, 2025",
    location: "Kyoto, Japan",
    image: record1,
    metric: "47 bullseyes",
    shortDescription: "An unprecedented streak of precision under extreme time pressure.",
    description:
      "Under the hush of the Kyoto indoor range, Aiyana Vance shattered a record many believed unreachable — landing 47 consecutive bullseyes in a single 60-second window with a traditional recurve bow. Verified by three independent ABWR adjudicators.",
    gallery: [record1, record4, record2],
  },
  {
    id: "ABWR-2025-002",
    title: "Longest Accurate Shot at Sunset",
    participant: "Mateus Aquino",
    category: "Distance Records",
    date: "January 02, 2025",
    location: "Atacama Desert, Chile",
    image: record2,
    metric: "412 meters",
    shortDescription: "A single arrow, twelve seconds of flight, one perfect score.",
    description:
      "From a windswept ridge in the Atacama, Mateus Aquino loosed a single arrow that traveled 412 meters and scored within the official ABWR target zone — the longest verified accurate shot in the federation's history.",
    gallery: [record2, record5, record4],
  },
  {
    id: "ABWR-2024-118",
    title: "Youngest Certified Champion",
    participant: "Theo Halvarsson",
    category: "Youth Records",
    date: "November 22, 2024",
    location: "Stockholm, Sweden",
    image: record3,
    metric: "7 years, 4 months",
    shortDescription: "Focus beyond his years on the ABWR junior circuit.",
    description:
      "Theo Halvarsson became the youngest archer ever to complete the full ABWR Junior Circuit, scoring above 92% across all six classified disciplines. A composed performance that has redefined youth archery development.",
    gallery: [record3, record1, record6],
  },
  {
    id: "ABWR-2024-097",
    title: "Tightest 10-Arrow Cluster",
    participant: "Hana Okonkwo",
    category: "Accuracy Records",
    date: "August 09, 2024",
    location: "Lagos, Nigeria",
    image: record4,
    metric: "11.2 mm spread",
    shortDescription: "Ten arrows. One impossible cluster.",
    description:
      "Measured by laser caliper, Hana Okonkwo's 10-arrow group spanned just 11.2 millimeters at competition distance. The cluster is now permanently archived in the ABWR Hall of Precision.",
    gallery: [record4, record1, record6],
  },
  {
    id: "ABWR-2024-064",
    title: "Mounted Archery Speed Record",
    participant: "Tariel Beridze",
    category: "Horseback Archery Records",
    date: "June 18, 2024",
    location: "Telavi, Georgia",
    image: record5,
    metric: "9 hits in 14.2s",
    shortDescription: "Reviving an ancient art with modern verification.",
    description:
      "Galloping at full speed across a 99-meter heritage track, Tariel Beridze landed 9 of 9 arrows on three moving targets in 14.2 seconds — the fastest verified mounted run in ABWR Heritage Division.",
    gallery: [record5, record2, record6],
  },
  {
    id: "ABWR-2023-241",
    title: "Most Restored Heritage Bow Shoot",
    participant: "The Andean Collective",
    category: "Traditional Archery Records",
    date: "October 30, 2023",
    location: "Cusco, Peru",
    image: record6,
    metric: "144 archers · 1 ceremony",
    shortDescription: "The largest ceremonial volley in the modern era.",
    description:
      "The Andean Collective gathered 144 archers from 22 villages, each carrying a restored ancestral bow, to release a single coordinated ceremonial volley — entered into the ABWR registry as a cultural milestone.",
    gallery: [record6, record5, record4],
  },
];

export const categories: RecordCategory[] = [
  "Archery Performance Records",
  "Distance Records",
  "Speed Records",
  "Endurance Records",
  "Accuracy Records",
  "Traditional Archery Records",
  "Horseback Archery Records",
  "Youth Records",
  "School Records",
  "College & University Records",
  "Team Records",
  "Corporate Records",
  "Mass Participation Records",
  "Innovation Records",
  "Para-Archery Records",
  "Coaching Records",
  "Open Record Category"
];

export const getStoredRecords = (): RecordItem[] => {
  if (typeof window === "undefined") return records;
  const data = localStorage.getItem("abwr_records");
  if (!data) {
    localStorage.setItem("abwr_records", JSON.stringify(records));
    return records;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return records;
  }
};

export const saveRecords = (items: RecordItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("abwr_records", JSON.stringify(items));
  }
};

export interface StoredSubmission {
  id: string;
  formType: "application" | "claim";
  category: "individual" | "organization" | "corporate";
  name: string;
  dob: string;
  orgName: string;
  orgType: string;
  repName: string;
  companyName: string;
  companyReg: string;
  email: string;
  phone: string;
  recordTitle: string;
  recordCategory: string;
  description: string;
  attemptDate: string;
  venue: string;
  achievedResult: string;
  witnessInfo: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  formData?: any;
}

export const getStoredSubmissions = (): StoredSubmission[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("abwr_submissions");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveSubmissions = (items: StoredSubmission[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("abwr_submissions", JSON.stringify(items));
  }
};

// ================= BACKEND API INTEGRATIONS =================

export const API_URL = import.meta.env.VITE_API_URL || "https://book-of-archery.onrender.com/api";

// 1. Records API
export const getRecordsApi = async (): Promise<RecordItem[]> => {
  try {
    const res = await fetch(`${API_URL}/records`);
    if (!res.ok) throw new Error("API response error");
    const data = await res.json();
    saveRecords(data); // update local cache
    return data;
  } catch (err) {
    console.warn("Backend offline. Falling back to local storage.", err);
    return getStoredRecords();
  }
};

export const getRecordByIdApi = async (id: string): Promise<RecordItem | null> => {
  try {
    const res = await fetch(`${API_URL}/records/${id}`);
    if (!res.ok) throw new Error("API response error");
    return await res.json();
  } catch (err) {
    console.warn("Backend offline. Falling back to local storage.", err);
    const local = getStoredRecords();
    return local.find((r) => r.id === id) || null;
  }
};

export const saveRecordApi = async (record: RecordItem, isEdit: boolean, token: string): Promise<boolean> => {
  try {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API_URL}/records/${record.id}` : `${API_URL}/records`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(record)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to save record to database:", err);
    return false;
  }
};

export const deleteRecordApi = async (id: string, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/records/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to delete record in database:", err);
    return false;
  }
};

// 2. Submissions API
export const getSubmissionsApi = async (token: string): Promise<StoredSubmission[]> => {
  try {
    const res = await fetch(`${API_URL}/submissions`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("API response error");
    const data = await res.json();
    saveSubmissions(data); // update local cache
    return data;
  } catch (err) {
    console.warn("Backend offline. Falling back to local storage.", err);
    return getStoredSubmissions();
  }
};

export const getMySubmissionsApi = async (token: string): Promise<StoredSubmission[]> => {
  try {
    const res = await fetch(`${API_URL}/submissions/my`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("API response error");
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Backend offline. Falling back to local storage.", err);
    return getStoredSubmissions();
  }
};

export const saveSubmissionApi = async (submission: StoredSubmission): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(submission)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to send submission to database, caching locally:", err);
    const current = getStoredSubmissions();
    saveSubmissions([submission, ...current]);
    return true;
  }
};

export const updateSubmissionStatusApi = async (id: string, status: "pending" | "approved" | "rejected", token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/submissions/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to update claim status in database:", err);
    return false;
  }
};

export const deleteSubmissionApi = async (id: string, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/submissions/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to delete claim from database:", err);
    return false;
  }
};

// 3. Contact Queries API
export interface ContactQuery {
  id?: number;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read";
  created_at?: string;
}

export const getContactsApi = async (token: string): Promise<ContactQuery[]> => {
  try {
    const res = await fetch(`${API_URL}/contacts`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("API response error");
    return await res.json();
  } catch (err) {
    console.error("Failed to load contact queries from database:", err);
    return [];
  }
};

export const saveContactApi = async (contact: { name: string; email: string; message: string }): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to send contact query to database:", err);
    return false;
  }
};

export const updateContactStatusApi = async (id: number, status: "unread" | "read", token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/contacts/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to update contact status in database:", err);
    return false;
  }
};

export const deleteContactApi = async (id: number, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/contacts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to delete contact query from database:", err);
    return false;
  }
};

// 4. User Management API
export interface UserItem {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  role: string;
  created_at?: string;
}

export const getUsersApi = async (token: string): Promise<UserItem[]> => {
  try {
    const res = await fetch(`${API_URL}/users`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("API response error");
    return await res.json();
  } catch (err) {
    console.error("Failed to retrieve user list from database:", err);
    return [];
  }
};

export const saveUserApi = async (user: UserItem, isEdit: boolean, token: string): Promise<boolean> => {
  try {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API_URL}/users/${user.id}` : `${API_URL}/users`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to save user details in database:", err);
    return false;
  }
};

export const deleteUserApi = async (id: number, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to delete user from database:", err);
    return false;
  }
};

// ================= 5. Homepage Stats API =================
export interface HomepageStat {
  id?: number;
  value: number;
  suffix: string;
  label: string;
}

export const defaultStats: HomepageStat[] = [
  { id: 1, value: 120, suffix: "+", label: "Verified Records" },
  { id: 2, value: 5, suffix: "", label: "Countries Represented" },
  { id: 3, value: 175, suffix: "+", label: "Registered Archers" },
  { id: 4, value: 2, suffix: "yrs", label: "Of Adjudication" },
];

export const getStoredStats = (): HomepageStat[] => {
  if (typeof window === "undefined") return defaultStats;
  const data = localStorage.getItem("abwr_stats");
  return data ? JSON.parse(data) : defaultStats;
};

export const saveStats = (items: HomepageStat[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("abwr_stats", JSON.stringify(items));
  }
};

export const getStatsApi = async (): Promise<HomepageStat[]> => {
  try {
    const res = await fetch(`${API_URL}/stats`);
    if (!res.ok) throw new Error("API response error");
    const data = await res.json();
    saveStats(data); // update local cache
    return data;
  } catch (err) {
    console.warn("Backend offline. Falling back to local storage stats.", err);
    return getStoredStats();
  }
};

export const saveStatApi = async (stat: HomepageStat, isEdit: boolean, token: string): Promise<boolean> => {
  try {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API_URL}/stats/${stat.id}` : `${API_URL}/stats`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(stat)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to save stat in database:", err);
    return false;
  }
};

export const deleteStatApi = async (id: number, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/stats/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to delete stat from database:", err);
    return false;
  }
};


// ================= 6. Testimonials API =================
export interface Testimonial {
  id?: number;
  quote: string;
  name: string;
  title: string;
}

export const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    quote: "ABWR's verification process is the gold standard. When my record was certified, I knew it had earned every millimeter.",
    name: "Aiyana Vance",
    title: "Record Holder · Kyoto, Japan",
  },
  {
    id: 2,
    quote: "They treat heritage archery with the seriousness it deserves. Our village's ceremony is now in the global registry.",
    name: "Tariel Beridze",
    title: "Mounted Archery · Telavi, Georgia",
  },
  {
    id: 3,
    quote: "From application to certificate, every step felt curated. ABWR doesn't just record — they preserve.",
    name: "Hana Okonkwo",
    title: "Precision Champion · Lagos, Nigeria",
  },
];

export const getStoredTestimonials = (): Testimonial[] => {
  if (typeof window === "undefined") return defaultTestimonials;
  const data = localStorage.getItem("abwr_testimonials");
  return data ? JSON.parse(data) : defaultTestimonials;
};

export const saveTestimonials = (items: Testimonial[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("abwr_testimonials", JSON.stringify(items));
  }
};

export const getTestimonialsApi = async (): Promise<Testimonial[]> => {
  try {
    const res = await fetch(`${API_URL}/testimonials`);
    if (!res.ok) throw new Error("API response error");
    const data = await res.json();
    saveTestimonials(data); // update local cache
    return data;
  } catch (err) {
    console.warn("Backend offline. Falling back to local storage testimonials.", err);
    return getStoredTestimonials();
  }
};

export const saveTestimonialApi = async (testimonial: Testimonial, isEdit: boolean, token: string): Promise<boolean> => {
  try {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API_URL}/testimonials/${testimonial.id}` : `${API_URL}/testimonials`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(testimonial)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to save testimonial in database:", err);
    return false;
  }
};

export const deleteTestimonialApi = async (id: number, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/testimonials/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to delete testimonial from database:", err);
    return false;
  }
};

