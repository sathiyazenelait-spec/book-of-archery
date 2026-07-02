import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/SiteLayout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Records from "./pages/Records.tsx";
import RecordDetail from "./pages/RecordDetail.tsx";
import Apply from "./pages/Apply.tsx";
import Downloads from "./pages/Downloads.tsx";
import Rules from "./pages/Rules.tsx";
import Blog from "./pages/Blog.tsx";
import Contact from "./pages/Contact.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import UserLogin from "./pages/UserLogin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import NotFound from "./pages/NotFound.tsx";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/index.html", element: <Index /> },
      { path: "/about", element: <About /> },
      { path: "/records", element: <Records /> },
      { path: "/records/:id", element: <RecordDetail /> },
      { path: "/apply", element: <Apply /> },
      { path: "/downloads", element: <Downloads /> },
      { path: "/rules", element: <Rules /> },
      { path: "/blog", element: <Blog /> },
      { path: "/contact", element: <Contact /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/login", element: <UserLogin /> },
      { path: "/login/admin", element: <AdminLogin /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
