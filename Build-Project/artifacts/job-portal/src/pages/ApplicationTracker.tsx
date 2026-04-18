import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { 
  Briefcase, Building2, CheckCircle2, Clock, XCircle, Loader2, AlertCircle,
  MapPin, IndianRupee, Calendar, Mail, Phone, MapPin as AddressIcon, BookOpen,
  Award, FileText, CheckSquare, ChevronRight
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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Application Tracker</h1>
        <p className="text-muted-foreground text-lg mt-2">Monitor the progress of your submitted job applications.</p>
      </div>

      {!applications?.length ? (
        <div className="bg-card p-12 rounded-3xl border border-border text-center shadow-sm">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You haven't applied to any positions. Browse the job directory to find your next great opportunity.
          </p>
          <Link href="/jobs" className="inline-flex px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-card rounded-3xl border border-border shadow-xl p-8">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5", getStatusColor(selectedApplication?.status))}>
                    {getStatusIcon(selectedApplication?.status)} {selectedApplication?.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Applied {selectedApplication ? format(new Date(selectedApplication.appliedAt), 'MMM dd, yyyy') : "-"}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-foreground">{selectedApplication?.job?.title || "Application Details"}</h3>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <Building2 className="w-4 h-4" /> {selectedApplication?.job?.company || "Company"}
                </p>
              </div>
              <div className="space-y-3">
                <Link href={`/jobs/${selectedApplication?.jobId}`} className="inline-flex px-5 py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">
                  View Job Posting
                </Link>
                <button onClick={() => navigate('/jobs')} className="inline-flex px-5 py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-all">
                  Browse More Jobs
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-secondary/10 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Application ID</p>
                <p className="text-lg font-bold">{selectedApplication?.id?.toString().padStart(6, '0')}</p>
              </div>
              <div className="bg-secondary/10 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Phone</p>
                <p className="font-semibold">{selectedApplication?.applicantPhone || 'Not provided'}</p>
              </div>
              <div className="bg-secondary/10 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Location</p>
                <p className="font-semibold">{selectedApplication?.applicantAddress || 'Not provided'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <p className="text-lg font-semibold text-blue-900 mb-3">Current Status</p>
                <p className="text-sm text-blue-800">Your application is currently in the <strong>{selectedApplication?.status}</strong> stage. The employer will contact you with next steps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <p className="text-sm text-muted-foreground mb-3 uppercase tracking-[0.25em]">Education</p>
                  <p className="text-base font-medium">{selectedApplication?.education || "Not provided"}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <p className="text-sm text-muted-foreground mb-3 uppercase tracking-[0.25em]">Qualification</p>
                  <p className="text-base font-medium">{selectedApplication?.qualification || "Not provided"}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-sm text-muted-foreground mb-3 uppercase tracking-[0.25em]">Resume</p>
                {selectedApplication?.resumeUrl ? (
                  <a href={selectedApplication.resumeUrl} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                    Open uploaded resume
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">No resume URL available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
