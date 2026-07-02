-- Create Database (if needed)
CREATE DATABASE IF NOT EXISTS abwr_db;
USE abwr_db;

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Records Table
CREATE TABLE IF NOT EXISTS records (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  participant VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  image TEXT NOT NULL,
  shortDescription TEXT NOT NULL,
  description TEXT NOT NULL,
  metric VARCHAR(100) NOT NULL,
  gallery JSON NOT NULL
);

-- 3. Create Submissions Table (Applications & Claims)
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(100) PRIMARY KEY,
  formType VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(255) NULL,
  dob VARCHAR(100) NULL,
  orgName VARCHAR(255) NULL,
  orgType VARCHAR(100) NULL,
  repName VARCHAR(255) NULL,
  companyName VARCHAR(255) NULL,
  companyReg VARCHAR(255) NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NULL,
  recordTitle VARCHAR(255) NOT NULL,
  recordCategory VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  attemptDate VARCHAR(100) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  achievedResult VARCHAR(255) NULL,
  witnessInfo TEXT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  formData JSON NULL,
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Contact Queries Table
CREATE TABLE IF NOT EXISTS contact_queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin User
-- Password: admin123 (hashed with bcrypt cost factor 10)
INSERT IGNORE INTO users (id, username, password, role) 
VALUES (1, 'admin', '$2a$10$9R2gN7EIy7R50m0teRLQReCG6ppHhz/NpieD16P0umbx5V76sIIXG', 'admin');

-- Seed Default Normal User
-- Password: user (hashed with bcrypt cost factor 10)
INSERT IGNORE INTO users (id, username, password, role) 
VALUES (2, 'user', '$2a$10$xmaZEBGc8JEmWyZIZ2cKpOk6gpH4405z1wVr2MhdlS8Hk7oV77zfa', 'user');

-- Seed Default Records
INSERT IGNORE INTO records (id, title, participant, category, date, location, image, shortDescription, description, metric, gallery)
VALUES 
(
  'ABWR-2025-001', 
  'Most Bullseyes in 60 Seconds', 
  'Aiyana Vance', 
  'Accuracy Records', 
  'March 14, 2025', 
  'Kyoto, Japan', 
  '/src/assets/record-1.jpg', 
  'An unprecedented streak of precision under extreme time pressure.', 
  'Under the hush of the Kyoto indoor range, Aiyana Vance shattered a record many believed unreachable — landing 47 consecutive bullseyes in a single 60-second window with a traditional recurve bow. Verified by three independent ABWR adjudicators.', 
  '47 bullseyes', 
  '["/src/assets/record-1.jpg", "/src/assets/record-4.jpg", "/src/assets/record-2.jpg"]'
),
(
  'ABWR-2025-002', 
  'Longest Accurate Shot at Sunset', 
  'Mateus Aquino', 
  'Distance Records', 
  'January 02, 2025', 
  'Atacama Desert, Chile', 
  '/src/assets/record-2.jpg', 
  'A single arrow, twelve seconds of flight, one perfect score.', 
  'From a windswept ridge in the Atacama, Mateus Aquino loosed a single arrow that traveled 412 meters and scored within the official ABWR target zone — the longest verified accurate shot in the federation\'s history.', 
  '412 meters', 
  '["/src/assets/record-2.jpg", "/src/assets/record-5.jpg", "/src/assets/record-4.jpg"]'
),
(
  'ABWR-2024-118', 
  'Youngest Certified Champion', 
  'Theo Halvarsson', 
  'Youth Records', 
  'November 22, 2024', 
  'Stockholm, Sweden', 
  '/src/assets/record-3.jpg', 
  'Focus beyond his years on the ABWR junior circuit.', 
  'Theo Halvarsson became the youngest archer ever to complete the full ABWR Junior Circuit, scoring above 92% across all six classified disciplines. A composed performance that has redefined youth archery development.', 
  '7 years, 4 months', 
  '["/src/assets/record-3.jpg", "/src/assets/record-1.jpg", "/src/assets/record-6.jpg"]'
),
(
  'ABWR-2024-097', 
  'Tightest 10-Arrow Cluster', 
  'Hana Okonkwo', 
  'Accuracy Records', 
  'August 09, 2024', 
  'Lagos, Nigeria', 
  '/src/assets/record-4.jpg', 
  'Ten arrows. One impossible cluster.', 
  'Measured by laser caliper, Hana Okonkwo\'s 10-arrow group spanned just 11.2 millimeters at competition distance. The cluster is now permanently archived in the ABWR Hall of Precision.', 
  '11.2 mm spread', 
  '["/src/assets/record-4.jpg", "/src/assets/record-1.jpg", "/src/assets/record-6.jpg"]'
),
(
  'ABWR-2024-064', 
  'Mounted Archery Speed Record', 
  'Tariel Beridze', 
  'Horseback Archery Records', 
  'June 18, 2024', 
  'Telavi, Georgia', 
  '/src/assets/record-5.jpg', 
  'Reviving an ancient art with modern verification.', 
  'Galloping at full speed across a 99-meter heritage track, Tariel Beridze landed 9 of 9 arrows on three moving targets in 14.2 seconds — the fastest verified mounted run in ABWR Heritage Division.', 
  '9 hits in 14.2s', 
  '["/src/assets/record-5.jpg", "/src/assets/record-2.jpg", "/src/assets/record-6.jpg"]'
),
(
  'ABWR-2023-241', 
  'Most Restored Heritage Bow Shoot', 
  'The Andean Collective', 
  'Traditional Archery Records', 
  'October 30, 2023', 
  'Cusco, Peru', 
  '/src/assets/record-6.jpg', 
  'The largest ceremonial volley in the modern era.', 
  'The Andean Collective gathered 144 archers from 22 villages, each carrying a restored ancestral bow, to release a single coordinated ceremonial volley — entered into the ABWR registry as a cultural milestone.', 
  '144 archers · 1 ceremony', 
  '["/src/assets/record-6.jpg", "/src/assets/record-5.jpg", "/src/assets/record-4.jpg"]'
);

-- 5. Create Homepage Stats Table
CREATE TABLE IF NOT EXISTS homepage_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value INT NOT NULL,
  suffix VARCHAR(20) DEFAULT '',
  label VARCHAR(255) NOT NULL
);

-- Seed Default Homepage Stats
INSERT IGNORE INTO homepage_stats (id, value, suffix, label)
VALUES 
(1, 120, '+', 'Verified Records'),
(2, 5, '', 'Countries Represented'),
(3, 175, '+', 'Registered Archers'),
(4, 2, 'yrs', 'Of Adjudication');

-- 6. Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL
);

-- Seed Default Testimonials
INSERT IGNORE INTO testimonials (id, quote, name, title)
VALUES 
(1, 'ABWR\'s verification process is the gold standard. When my record was certified, I knew it had earned every millimeter.', 'Aiyana Vance', 'Record Holder · Kyoto, Japan'),
(2, 'They treat heritage archery with the seriousness it deserves. Our village\'s ceremony is now in the global registry.', 'Tariel Beridze', 'Mounted Archery · Telavi, Georgia'),
(3, 'From application to certificate, every step felt curated. ABWR doesn\'t just record — they preserve.', 'Hana Okonkwo', 'Precision Champion · Lagos, Nigeria');
