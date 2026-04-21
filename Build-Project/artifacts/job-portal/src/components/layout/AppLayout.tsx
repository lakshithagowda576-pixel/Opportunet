import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Briefcase, LayoutDashboard, FileText, GraduationCap, Menu, X,
  Bell, Shield, LogOut, LogIn, ChevronDown, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Job Directory", href: "/jobs", icon: Briefcase },
    { name: "My Applications", href: "/applications", icon: FileText },
    { name: "PG-CET Hub", href: "/exams", icon: GraduationCap },
  ];

  if (user?.role === "admin") {
    navigation.push({ name: "Admin Panel", href: "/admin", icon: Shield });
  }

  const initials = user ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                    alt="Logo" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <span className="font-display font-bold text-xl text-foreground tracking-tight hidden sm:block">
                  Gov<span className="text-primary">Portal</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group flex items-center gap-2",
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : item.href === "/admin" 
                          ? "text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : item.href === "/admin" ? "text-amber-600" : "text-muted-foreground group-hover:text-foreground")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
              </button>

              {/* Auth area */}
              {!isLoading && (
                user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : initials}
                      </div>
                      <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </button>

                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-3 border-b border-border bg-secondary/50">
                            <p className="font-semibold text-foreground text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            {user.role === "admin" && (
                              <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                            )}
                          </div>
                          <div className="p-1.5">
                            {user.role === "admin" && (
                              <Link href="/admin" onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors">
                                <Shield className="w-4 h-4" /> Admin Panel
                              </Link>
                            )}
                            <Link href="/applications" onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                              <FileText className="w-4 h-4" /> My Applications
                            </Link>
                            <button
                              onClick={() => { logout(); setIsUserMenuOpen(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                              <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                )
              )}

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-sm pt-16">
          <nav className="px-4 py-6 flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-sm">{initials}</div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium bg-red-50 text-red-700">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium bg-primary text-white">
                  <LogIn className="w-5 h-5" /> Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
