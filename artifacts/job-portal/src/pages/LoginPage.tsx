import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, Lock, User, Eye, EyeOff, GraduationCap, Github, Chrome, Linkedin, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const socialProviders = [
    {
      name: "Google",
      icon: <Chrome className="w-4 h-4" />,
      color: "border-red-200 hover:bg-red-50 text-red-700",
      href: "http://localhost:3008/api/auth/google",
    },
    {
      name: "GitHub",
      icon: <Github className="w-4 h-4" />,
      color: "border-gray-300 hover:bg-gray-50 text-gray-700",
      href: `${BASE}/api/auth/github`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      color: "border-blue-200 hover:bg-blue-50 text-blue-700",
      href: `${BASE}/api/auth/linkedin`,
    },
  ];

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
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === "login" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === "register" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {/* Social Login */}
            <div className="space-y-2 mb-6">
              {socialProviders.map(p => (
                <a
                  key={p.name}
                  href={p.href}
                  className={`flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors ${p.color}`}
                >
                  {p.icon} Continue with {p.name}
                </a>
              ))}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium">or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              )}
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
                    placeholder={mode === "register" ? "Min 6 characters" : "Enter password"}
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="text-right">
                  <span className="text-xs text-primary cursor-pointer hover:underline">
                    Admin? Use admin@govportal.com / Admin@123
                  </span>
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-5">
              {mode === "login" ? "New here? " : "Already have an account? "}
              <button onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary font-semibold hover:underline">
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
