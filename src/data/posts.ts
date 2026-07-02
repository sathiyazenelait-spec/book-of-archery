export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export const posts: BlogPost[] = [
  {
    slug: "spring-circuit-2025",
    title: "Spring Circuit 2025: Three Continents, One Standard",
    excerpt: "The ABWR adjudication panel travels from Kyoto to Lima this season — here's what to expect.",
    date: "April 02, 2025",
    category: "Announcement",
    readTime: "4 min read",
  },
  {
    slug: "judging-protocol-update",
    title: "Updated Judging Protocol for Long-Range Verification",
    excerpt: "Why we're moving to dual-laser confirmation for all attempts above 300 meters.",
    date: "March 18, 2025",
    category: "Standards",
    readTime: "6 min read",
  },
  {
    slug: "youth-program-launch",
    title: "Launching the ABWR Youth Pathway",
    excerpt: "A structured route for archers under 14 to enter the global registry safely.",
    date: "February 27, 2025",
    category: "Programs",
    readTime: "3 min read",
  },
];
