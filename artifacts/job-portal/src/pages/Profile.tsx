import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  User, Mail, MapPin, Calendar, Briefcase, 
  Settings, LogOut, Shield, Award, BookOpen, 
  ExternalLink, ChevronRight, Edit2, Camera,
  CheckCircle2, Clock, FileText, Star, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    education: user?.education || "",
    qualification: user?.qualification || "",
    skills: user?.skills || "",
  });

  const { refetch } = useAuth();

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        education: user.education || "",
        qualification: user.qualification || "",
        skills: user.skills || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications");
        if (response.ok) {
          const data = await response.json();
          setApplications(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Please sign in to view your profile and manage your applications.
        </p>
        <Link href="/login" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
          Sign In
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        await refetch();
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  
  const skillsList = user.skills ? user.skills.split(",").map(s => s.trim()) : [];
  
  const completionStatus = [
    user.name, user.phone, user.address, user.bio, 
    user.education, user.qualification, user.resumeUrl
  ].filter(Boolean).length * 14;

  const stats = [
    { label: "Applications", value: applications.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Interviews", value: applications.filter(a => a.status === 'Interview').length, icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Offers", value: applications.filter(a => a.status === 'Offered').length, icon: Award, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Completion", value: `${completionStatus}%`, icon: Star, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      {/* Profile Header / Banner */}
      <div className="relative mb-24">
        <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-primary/80 via-accent/80 to-primary/80 rounded-3xl overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/30">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute -bottom-16 left-8 right-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full md:w-auto">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-background bg-card overflow-hidden shadow-2xl flex items-center justify-center relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl sm:text-5xl font-bold text-white">
                    {initials}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-background rounded-full"></div>
            </div>

            <div className="mb-2 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200 uppercase tracking-wider">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                <Briefcase className="w-4 h-4" /> {user.education || "No Education Listed"} • {user.address || "No Location"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
            <button className="p-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all border border-border">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
        {/* Left Column: Sidebar Info */}
        <div className="space-y-6">
          {/* About Section */}
          <div className="glass-panel p-6 rounded-3xl border border-border/50">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> About Me
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.bio || "Write something about yourself to attract employers."}
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-semibold truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Location</p>
                  <p className="text-sm font-semibold">{user.address || "Not Set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Joined Date</p>
                  <p className="text-sm font-semibold">{user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : "Recently"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Profile Score</h3>
              <span className="text-2xl font-black text-primary">{completionStatus}%</span>
            </div>
            <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000" 
                style={{ width: `${completionStatus}%` }}
              ></div>
            </div>
            <p className="text-xs text-primary/70 mt-3 font-medium">Complete your profile to enable Fast Apply and increase your chances.</p>
          </div>

          {/* Skills Section */}
          <div className="glass-panel p-6 rounded-3xl border border-border/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Skills</h3>
              <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsList.length > 0 ? skillsList.map((skill: string) => (
                <span key={skill} className="px-3 py-1.5 bg-secondary/50 text-secondary-foreground rounded-xl text-xs font-bold border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-default">
                  {skill}
                </span>
              )) : (
                <p className="text-xs text-muted-foreground italic">No skills added yet.</p>
              )}
              <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 border border-dashed border-muted-foreground/30 rounded-xl text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all">
                + Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel p-5 rounded-3xl border border-border/50 hover:shadow-md transition-all group">
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Applications */}
          <div className="glass-panel p-8 rounded-3xl border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Applications</h3>
              <Link href="/applications" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 w-full bg-secondary/50 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50 hover:bg-secondary/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-border group-hover:border-primary/30 transition-colors">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{app.job?.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{app.job?.company} • {format(new Date(app.appliedAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        app.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        app.status === 'Offered' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      )}>
                        {app.status}
                      </span>
                      <Link href={`/jobs/${app.jobId}`} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-dashed border-border">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">No applications yet</p>
                <Link href="/jobs" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">Find your first job</Link>
              </div>
            )}
          </div>

          {/* Resume / Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <button className="text-xs font-bold text-primary hover:underline">Update</button>
              </div>
              <h4 className="font-bold text-lg">Curriculum Vitae</h4>
              <p className="text-xs text-muted-foreground mt-1">Updated 2 days ago • PDF (420KB)</p>
              <button className="w-full mt-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl text-sm transition-all border border-border">
                Download Resume
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <button className="text-xs font-bold text-accent hover:underline">Edit</button>
              </div>
              <h4 className="font-bold text-lg">Portfolio Website</h4>
              <p className="text-xs text-muted-foreground mt-1">https://johndoe.design</p>
              <button className="w-full mt-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl text-sm transition-all border border-border">
                View Live Site
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-border">
            <button 
              onClick={() => logout()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all border border-red-100"
            >
              <LogOut className="w-4 h-4" /> Sign Out from All Devices
            </button>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-display font-black">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Camera className="w-6 h-6 rotate-45 text-muted-foreground" /> {/* Using camera icon as close for now or just X if available */}
                </button>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <input 
                      type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:bg-background outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                    <input 
                      type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:bg-background outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                    <input 
                      type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:bg-background outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Education</label>
                    <input 
                      type="text" value={editForm.education} onChange={e => setEditForm({...editForm, education: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:bg-background outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Bio</label>
                  <textarea 
                    value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    rows={3}
                    className="w-full px-5 py-3.5 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:bg-background outline-none transition-all text-sm font-medium resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Skills (comma separated)</label>
                  <input 
                    type="text" value={editForm.skills} onChange={e => setEditForm({...editForm, skills: e.target.value})}
                    placeholder="React, TypeScript, Node.js"
                    className="w-full px-5 py-3.5 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:bg-background outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit" disabled={isUpdating}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Save Changes"}
                  </button>
                  <button 
                    type="button" onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
