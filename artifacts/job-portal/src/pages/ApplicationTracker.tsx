import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Briefcase, Building2, CheckCircle2, Clock, XCircle, Loader2, AlertCircle,
  MapPin, IndianRupee, Calendar, Mail, Phone, MapPin as AddressIcon, BookOpen,
  Award, FileText, CheckSquare, ChevronRight, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STEPS = ["Pending", "Reviewed", "Interview", "Offered"];

export default function ApplicationTracker() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications");
        const data = await response.json();
        setApplications(data || []);
        
        // Parse the application ID from URL if present
        const searchParams = new URLSearchParams(window.location.search);
        const focusId = searchParams.get('id');
        
        if (focusId) {
          const focused = data.find((a: any) => a.id === parseInt(focusId));
          if (focused) {
            setSelectedApplication(focused);
            return;
          }
        }
        
        if (data?.length > 0) {
          setSelectedApplication(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-600 bg-amber-50 border-amber-300';
      case 'Reviewed':
        return 'text-blue-600 bg-blue-50 border-blue-300';
      case 'Interview':
        return 'text-purple-600 bg-purple-50 border-purple-300';
      case 'Offered':
        return 'text-emerald-600 bg-emerald-50 border-emerald-300';
      case 'Rejected':
        return 'text-red-600 bg-red-50 border-red-300';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Offered': return <CheckCircle2 className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <div className="w-2 h-2 rounded-full bg-current"></div>;
    }
  };

  const getStepIndex = (status: string) => STATUS_STEPS.indexOf(status);

  if (isLoading || isAuthLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-900 mb-2">Login Required</h1>
          <p className="text-amber-700 mb-6">You must be logged in to track your applications. Please sign in to continue.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-lg transition-all inline-block">
              Sign In / Register
            </Link>
            <Link href="/jobs" className="px-8 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all inline-block">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-foreground tracking-tight">Application Tracker</h1>
          <p className="text-muted-foreground text-lg mt-2 font-medium">Monitor the progress of your {applications.length} submitted applications.</p>
        </div>
        <Link href="/jobs" className="px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
          <Briefcase className="w-5 h-5" /> Find More Jobs
        </Link>
      </div>

      {!applications?.length ? (
        <div className="bg-card p-16 rounded-[2.5rem] border border-border text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <Briefcase className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-3xl font-black mb-3">No applications yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
            You haven't applied to any positions. Browse the job directory to find your next great opportunity.
          </p>
          <Link href="/jobs" className="inline-flex px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Browse Jobs Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar List */}
          <div className="lg:col-span-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                className={cn(
                  "w-full text-left p-5 rounded-[2rem] border transition-all duration-300 group",
                  selectedApplication?.id === app.id
                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                    : "bg-card border-border hover:border-primary/50 hover:bg-secondary/50 shadow-sm"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                    selectedApplication?.id === app.id ? "bg-white/20" : "bg-primary/10"
                  )}>
                    {app.examId ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    selectedApplication?.id === app.id 
                      ? "bg-white/20 border-white/30 text-white" 
                      : getStatusColor(app.status)
                  )}>
                    {app.status}
                  </span>
                </div>
                <h4 className="font-black text-lg leading-tight mb-1 truncate">
                  {app.examId ? app.examName : app.job?.title || "Application"}
                </h4>
                <p className={cn(
                  "text-xs font-medium truncate",
                  selectedApplication?.id === app.id ? "text-white/80" : "text-muted-foreground"
                )}>
                  {app.examId ? "KEA Karnataka" : app.job?.company || "Company"}
                </p>
                <div className={cn(
                  "mt-4 pt-4 border-t flex justify-between items-center",
                  selectedApplication?.id === app.id ? "border-white/10" : "border-border"
                )}>
                  <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider">
                    {format(new Date(app.appliedAt), 'MMM dd, yyyy')}
                  </span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform group-hover:translate-x-1",
                    selectedApplication?.id === app.id ? "text-white" : "text-primary"
                  )} />
                </div>
              </button>
            ))}
          </div>

          {/* Details Content */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-[3rem] border border-border shadow-2xl overflow-hidden animate-in slide-in-from-right-10 duration-500">
              <div className="relative h-32 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <button 
                  onClick={() => navigate('/jobs')}
                  className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all border border-white/20"
                >
                  <Briefcase className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 md:px-12 pb-12 -mt-12 relative">
                <div className="w-24 h-24 rounded-3xl border-8 border-background bg-card shadow-xl flex items-center justify-center mb-6">
                  {selectedApplication?.examId ? (
                    <GraduationCap className="w-10 h-10 text-primary" />
                  ) : (
                    <Building2 className="w-10 h-10 text-primary" />
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border flex items-center gap-2", getStatusColor(selectedApplication?.status))}>
                        {getStatusIcon(selectedApplication?.status)} {selectedApplication?.status}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> 
                        {selectedApplication?.examId ? "Registered" : "Applied"} {selectedApplication ? format(new Date(selectedApplication.appliedAt), 'MMMM dd, yyyy') : "-"}
                      </span>
                    </div>
                    <h3 className="text-4xl font-display font-black text-foreground leading-tight">
                      {selectedApplication?.examId ? selectedApplication?.examName : selectedApplication?.job?.title || "Application Details"}
                    </h3>
                    <p className="text-xl font-bold text-primary flex items-center gap-2">
                      {selectedApplication?.examId ? "KEA Official" : selectedApplication?.job?.company || "Company"}
                    </p>
                  </div>
                  
                  {selectedApplication?.jobId && (
                    <Link href={`/jobs/${selectedApplication?.jobId}`} className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-center">
                      View Job Details
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  <div className="glass-panel p-6 rounded-3xl border border-border/50">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground mb-3 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> {selectedApplication?.examId ? "Application No" : "Tracking ID"}
                    </p>
                    <p className="text-xl font-black text-foreground">#{(selectedApplication?.id || 0).toString().padStart(6, '0')}</p>
                  </div>
                  <div className="glass-panel p-6 rounded-3xl border border-border/50">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground mb-3 flex items-center gap-2">
                      {selectedApplication?.examId ? <BookOpen className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                      {selectedApplication?.examId ? "Selected Course" : "Contact Info"}
                    </p>
                    <p className="text-lg font-black text-foreground">
                      {selectedApplication?.examId ? selectedApplication?.course : selectedApplication?.applicantPhone || 'Not provided'}
                    </p>
                  </div>
                  <div className="glass-panel p-6 rounded-3xl border border-border/50">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground mb-3 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Location
                    </p>
                    <p className="text-lg font-black text-foreground truncate">{selectedApplication?.applicantAddress || 'Remote / Not Set'}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className={cn(
                    "rounded-[2rem] p-8 border",
                    selectedApplication?.status === 'Rejected' ? 'bg-red-50 border-red-100' :
                    selectedApplication?.status === 'Offered' ? 'bg-emerald-50 border-emerald-100' :
                    'bg-blue-50 border-blue-100'
                  )}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        selectedApplication?.status === 'Rejected' ? 'bg-red-500 text-white' :
                        selectedApplication?.status === 'Offered' ? 'bg-emerald-500 text-white' :
                        'bg-blue-500 text-white'
                      )}>
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className={cn(
                          "text-xl font-black",
                          selectedApplication?.status === 'Rejected' ? 'text-red-900' :
                          selectedApplication?.status === 'Offered' ? 'text-emerald-900' :
                          'text-blue-900'
                        )}>Current Stage: {selectedApplication?.status}</h4>
                        <p className={cn(
                          "text-sm font-medium",
                          selectedApplication?.status === 'Rejected' ? 'text-red-700' :
                          selectedApplication?.status === 'Offered' ? 'text-emerald-700' :
                          'text-blue-700'
                        )}>Updated {format(new Date(selectedApplication?.appliedAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <p className={cn(
                      "text-sm leading-relaxed font-medium",
                      selectedApplication?.status === 'Rejected' ? 'text-red-800' :
                      selectedApplication?.status === 'Offered' ? 'text-emerald-800' :
                      'text-blue-800'
                    )}>
                      {selectedApplication?.status === 'Pending' ? "Your application is under initial review by our recruitment team." :
                       selectedApplication?.status === 'Reviewed' ? "Good news! Your profile has been reviewed and shortlisted." :
                       selectedApplication?.status === 'Interview' ? "You have an upcoming interview. Check your email for details." :
                       selectedApplication?.status === 'Offered' ? "Congratulations! We have sent you a job offer. Please review it." :
                       selectedApplication?.status === 'Rejected' ? "Thank you for your interest. We've decided to move forward with other candidates." :
                       "Your application status is being updated."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Education Background</p>
                      <div className="bg-secondary/30 p-5 rounded-2xl border border-border">
                        <p className="text-sm font-bold">{selectedApplication?.education || "Information not provided"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Professional Qualification</p>
                      <div className="bg-secondary/30 p-5 rounded-2xl border border-border">
                        <p className="text-sm font-bold">{selectedApplication?.qualification || "Information not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Submitted Documents</p>
                    <div className="bg-secondary/30 p-6 rounded-[2rem] border border-border flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Curriculum Vitae / Resume</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">PDF DOCUMENT</p>
                        </div>
                      </div>
                      {selectedApplication?.resumeUrl ? (
                        <a 
                          href={selectedApplication.resumeUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-6 py-3 bg-white text-primary border border-primary/20 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all"
                        >
                          View Document
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">No file attached</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
