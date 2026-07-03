import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "abwr_jwt_secret_key_2026_secure";

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection Health Check & Auto Initialization Verification
try {
  const [rows] = await db.query("SELECT 1");
  console.log("MySQL connection established successfully.");
  // Ensure the phone column exists in users table
  try {
    await db.query("ALTER TABLE users ADD COLUMN phone VARCHAR(100) NULL");
    console.log("Users table phone column verified/added.");
  } catch (alterErr) {
    if (alterErr.code !== "ER_DUP_COLUMN_NAME" && !alterErr.message.includes("Duplicate column name")) {
      console.warn("Notice: alter users table error:", alterErr.message);
    }
  }
} catch (err) {
  console.warn("WARNING: MySQL connection failed. Ensure your database server is running and configured correctly.", err.message);
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access forbidden. Invalid token." });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Administrator privileges required." });
  }
};

// ================= AUTHENTICATION ENDPOINTS =================

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error during login.", details: err.message });
  }
});

// Register standard user
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  try {
    // Check if username already exists
    const [existing] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Username already taken." });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, 'user')",
      [username, email, hash, phone || null]
    );

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error registering user.", details: err.message });
  }
});

// Get Current User Info
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ================= USER MANAGEMENT ENDPOINTS (Admin Only) =================

// Get all users
app.get("/api/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, username, email, phone, role, created_at FROM users ORDER BY id DESC");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving users.", details: err.message });
  }
});

// Create new user
app.post("/api/users", authenticateToken, isAdmin, async (req, res) => {
  const { username, password, role, email, phone } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "user";

    const [result] = await db.query(
      "INSERT INTO users (username, password, role, email, phone) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, userRole, email || null, phone || null]
    );

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: result.insertId,
        username,
        role: userRole,
        email: email || null,
        phone: phone || null
      }
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Username already exists." });
    }
    res.status(500).json({ error: "Database error creating user.", details: err.message });
  }
});

// Update user
app.put("/api/users/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, password, role, email, phone } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    let query = "UPDATE users SET username = ?, role = ?, email = ?, phone = ? WHERE id = ?";
    let params = [username, role || "user", email || null, phone || null, id];

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE users SET username = ?, password = ?, role = ?, email = ?, phone = ? WHERE id = ?";
      params = [username, hashedPassword, role || "user", email || null, phone || null, id];
    }

    await db.query(query, params);
    res.json({ message: "User updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error updating user.", details: err.message });
  }
});

// Delete user
app.delete("/api/users/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: "Administrators cannot delete their own accounts." });
  }

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error deleting user.", details: err.message });
  }
});

// ================= RECORDS ENDPOINTS =================

// Get all records
app.get("/api/records", async (req, res) => {
  try {
    const [records] = await db.query("SELECT * FROM records ORDER BY id DESC");
    
    // Parse gallery JSON string
    const parsedRecords = records.map(rec => ({
      ...rec,
      gallery: typeof rec.gallery === "string" ? JSON.parse(rec.gallery) : rec.gallery
    }));

    res.json(parsedRecords);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving records.", details: err.message });
  }
});

// Get single record
app.get("/api/records/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [records] = await db.query("SELECT * FROM records WHERE id = ?", [id]);
    if (records.length === 0) {
      return res.status(404).json({ error: "Record not found." });
    }
    const rec = records[0];
    rec.gallery = typeof rec.gallery === "string" ? JSON.parse(rec.gallery) : rec.gallery;
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving record.", details: err.message });
  }
});

// Create record (Admin Only)
app.post("/api/records", authenticateToken, isAdmin, async (req, res) => {
  const {
    id, title, participant, category, date, location, image, shortDescription, description, metric, gallery
  } = req.body;

  if (!id || !title || !participant || !location || !metric || !description) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  try {
    const galleryJson = JSON.stringify(gallery || [image]);
    await db.query(
      "INSERT INTO records (id, title, participant, category, date, location, image, shortDescription, description, metric, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, title, participant, category, date, location, image, shortDescription, description, metric, galleryJson]
    );
    res.status(201).json({ message: "Record added successfully.", record: req.body });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Record ID already exists." });
    }
    res.status(500).json({ error: "Database error creating record.", details: err.message });
  }
});

// Update record (Admin Only)
app.put("/api/records/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    title, participant, category, date, location, image, shortDescription, description, metric, gallery
  } = req.body;

  try {
    const galleryJson = JSON.stringify(gallery || [image]);
    await db.query(
      "UPDATE records SET title = ?, participant = ?, category = ?, date = ?, location = ?, image = ?, shortDescription = ?, description = ?, metric = ?, gallery = ? WHERE id = ?",
      [title, participant, category, date, location, image, shortDescription, description, metric, galleryJson, id]
    );
    res.json({ message: "Record updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error updating record.", details: err.message });
  }
});

// Delete record (Admin Only)
app.delete("/api/records/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM records WHERE id = ?", [id]);
    res.json({ message: "Record deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error deleting record.", details: err.message });
  }
});

// ================= SUBMISSIONS ENDPOINTS =================

// Get all submissions (Admin Only)
app.get("/api/submissions", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [submissions] = await db.query("SELECT * FROM submissions ORDER BY submittedAt DESC");
    const parsed = submissions.map(s => {
      if (s.formData) {
        try {
          s.formData = typeof s.formData === "string" ? JSON.parse(s.formData) : s.formData;
        } catch (e) {
          s.formData = null;
        }
      }
      return s;
    });
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving submissions.", details: err.message });
  }
});

// Get user specific submissions
app.get("/api/submissions/my", authenticateToken, async (req, res) => {
  try {
    let submissions = [];
    if (req.user.role === "admin") {
      const [data] = await db.query("SELECT * FROM submissions ORDER BY submittedAt DESC");
      submissions = data;
    } else {
      // Filter submissions matching standard user email/username
      const [data] = await db.query(
        "SELECT * FROM submissions WHERE email = ? OR name = ? ORDER BY submittedAt DESC",
        [req.user.username, req.user.username]
      );
      submissions = data;
    }

    const parsed = submissions.map(s => {
      if (s.formData) {
        try {
          s.formData = typeof s.formData === "string" ? JSON.parse(s.formData) : s.formData;
        } catch (e) {
          s.formData = null;
        }
      }
      return s;
    });
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving user submissions.", details: err.message });
  }
});

// Create submission (Public / User Frontend)
app.post("/api/submissions", async (req, res) => {
  const {
    id, formType, category, name, dob, orgName, orgType, repName, companyName, companyReg, email, phone, recordTitle, recordCategory, description, attemptDate, venue, achievedResult, witnessInfo, formData
  } = req.body;

  if (!id || !formType || !category || !email || !recordTitle || !description) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  try {
    const formDataJson = formData ? JSON.stringify(formData) : null;
    await db.query(
      "INSERT INTO submissions (id, formType, category, name, dob, orgName, orgType, repName, companyName, companyReg, email, phone, recordTitle, recordCategory, description, attemptDate, venue, achievedResult, witnessInfo, formData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, formType, category, name, dob, orgName, orgType, repName, companyName, companyReg, email, phone, recordTitle, recordCategory, description, attemptDate, venue, achievedResult, witnessInfo, formDataJson]
    );
    res.status(201).json({ message: "Submission stored successfully.", id });
  } catch (err) {
    res.status(500).json({ error: "Database error storing submission.", details: err.message });
  }
});

// Update submission status (Admin Only)
app.put("/api/submissions/:id/status", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    await db.query("UPDATE submissions SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: `Submission status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ error: "Database error updating submission status.", details: err.message });
  }
});

// Delete submission history (Admin Only)
app.delete("/api/submissions/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM submissions WHERE id = ?", [id]);
    res.json({ message: "Submission history entry deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error deleting submission.", details: err.message });
  }
});

// ================= CONTACT MESSAGES ENDPOINTS =================

// Get all contact messages (Admin Only)
app.get("/api/contacts", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [messages] = await db.query("SELECT * FROM contact_queries ORDER BY created_at DESC");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving contact messages.", details: err.message });
  }
});

// Post a contact message (Public)
app.post("/api/contacts", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message details are required." });
  }

  try {
    await db.query(
      "INSERT INTO contact_queries (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );
    res.status(201).json({ message: "Contact query received successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error saving contact query.", details: err.message });
  }
});

// Update contact query status (Admin Only)
app.put("/api/contacts/:id/status", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'read' or 'unread'

  try {
    await db.query("UPDATE contact_queries SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Contact query status updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error updating query status.", details: err.message });
  }
});

// Delete contact query (Admin Only)
app.delete("/api/contacts/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM contact_queries WHERE id = ?", [id]);
    res.json({ message: "Contact query deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error deleting contact query.", details: err.message });
  }
});

// ================= STATS ENDPOINTS =================

// Get all stats (Public)
app.get("/api/stats", async (req, res) => {
  try {
    const [stats] = await db.query("SELECT * FROM homepage_stats ORDER BY id ASC");
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving stats.", details: err.message });
  }
});

// Create new stat (Admin Only)
app.post("/api/stats", authenticateToken, isAdmin, async (req, res) => {
  const { value, suffix, label } = req.body;

  if (value === undefined || !label) {
    return res.status(400).json({ error: "Value and label are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO homepage_stats (value, suffix, label) VALUES (?, ?, ?)",
      [value, suffix || "", label]
    );
    res.status(201).json({
      message: "Stat created successfully.",
      stat: { id: result.insertId, value, suffix: suffix || "", label }
    });
  } catch (err) {
    res.status(500).json({ error: "Database error creating stat.", details: err.message });
  }
});

// Update stat (Admin Only)
app.put("/api/stats/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { value, suffix, label } = req.body;

  if (value === undefined || !label) {
    return res.status(400).json({ error: "Value and label are required." });
  }

  try {
    await db.query(
      "UPDATE homepage_stats SET value = ?, suffix = ?, label = ? WHERE id = ?",
      [value, suffix || "", label, id]
    );
    res.json({ message: "Stat updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error updating stat.", details: err.message });
  }
});

// Delete stat (Admin Only)
app.delete("/api/stats/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM homepage_stats WHERE id = ?", [id]);
    res.json({ message: "Stat deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error deleting stat.", details: err.message });
  }
});


// ================= TESTIMONIALS ENDPOINTS =================

// Get all testimonials (Public)
app.get("/api/testimonials", async (req, res) => {
  try {
    const [testimonials] = await db.query("SELECT * FROM testimonials ORDER BY id ASC");
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: "Database error retrieving testimonials.", details: err.message });
  }
});

// Create testimonial (Admin Only)
app.post("/api/testimonials", authenticateToken, isAdmin, async (req, res) => {
  const { quote, name, title } = req.body;

  if (!quote || !name || !title) {
    return res.status(400).json({ error: "Quote, name, and title are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO testimonials (quote, name, title) VALUES (?, ?, ?)",
      [quote, name, title]
    );
    res.status(201).json({
      message: "Testimonial created successfully.",
      testimonial: { id: result.insertId, quote, name, title }
    });
  } catch (err) {
    res.status(500).json({ error: "Database error creating testimonial.", details: err.message });
  }
});

// Update testimonial (Admin Only)
app.put("/api/testimonials/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { quote, name, title } = req.body;

  if (!quote || !name || !title) {
    return res.status(400).json({ error: "Quote, name, and title are required." });
  }

  try {
    await db.query(
      "UPDATE testimonials SET quote = ?, name = ?, title = ? WHERE id = ?",
      [quote, name, title, id]
    );
    res.json({ message: "Testimonial updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error updating testimonial.", details: err.message });
  }
});

// Delete testimonial (Admin Only)
app.delete("/api/testimonials/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM testimonials WHERE id = ?", [id]);
    res.json({ message: "Testimonial deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Database error deleting testimonial.", details: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`ABWR Backend Server is running on port ${PORT}`);
});
