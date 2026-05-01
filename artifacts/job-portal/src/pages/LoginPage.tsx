import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 p-2 overflow-hidden">
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="OpportuNet Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">OpportuNet</span>
          </div>
          <p className="text-muted-foreground text-sm">Connecting Talent with Opportunities Beyond Boundaries</p>
        </div>

        <div className="bg-card rounded-3xl shadow-2xl shadow-primary/10 border border-border overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-center mb-6">Admin Sign In</h2>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPass ? "text" : "password"} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  Use: admin@govportal.com / Admin@123
                </span>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
