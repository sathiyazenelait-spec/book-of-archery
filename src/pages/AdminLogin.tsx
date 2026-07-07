import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/data/records";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getParsedToken = () => {
    const token = sessionStorage.getItem("abwr_admin_token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  // Redirect if already logged in as admin
  useEffect(() => {
    const session = sessionStorage.getItem("abwr_admin_is_logged_in");
    const currentUser = getParsedToken();
    if (session === "true" && currentUser && currentUser.role === "admin") {
      window.location.href = "/admin";
    }
  }, []);

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
        if (data.user.role !== "admin") {
          toast.error("Access Denied: Standard member accounts cannot log in on this administrative page.");
          return;
        }

        sessionStorage.setItem("abwr_admin_token", data.token);
        sessionStorage.setItem("abwr_admin_is_logged_in", "true");
        toast.success(`Access granted. Welcome back, ${data.user.username}`);
        
        // Redirect to admin dashboard
        window.location.href = "/admin";
      } else {
        toast.error(data.error || "Invalid administrator credentials");
      }
    } catch (err) {
      toast.error("Failed to connect to backend server.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Portal Access"
        title={<>Admin <em className="text-gradient-gold not-italic">Sign In</em></>}
        description="Hidden checkpoint for authenticated administrators."
      />

      <section className="container pb-32">
        <div className="max-w-xl mx-auto bg-card/60 backdrop-blur-md border border-border/60 p-12 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-gold" />
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={20} />
          </div>

          <h3 className="font-display text-2xl text-center mb-6 text-foreground">Sign In</h3>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Username</Label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter administrator username"
                required
                className="bg-background border-border/60 focus-visible:ring-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Passcode</Label>
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
              Authenticate Access
            </Button>
          </form>
          <div className="text-[10px] text-center text-muted-foreground mt-6 font-mono leading-relaxed">
            Administrative credentials required.
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
