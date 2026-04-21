import { useState } from "react";
import { useRoute } from "wouter";
import { 
  useGetJob, 
  useGetJobApplicantCount, 
  useCreateApplication
} from "@workspace/api-client-react";
import { 
  Building2, MapPin, Clock, IndianRupee, 
  Calendar, CheckCircle2, Users, AlertCircle, 
  Loader2, ArrowLeft, Mail, BookOpen, ListChecks, Briefcase, ExternalLink
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function JobDetails() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = Number(params?.id);
  const { toast } = useToast();

  const { data: job, isLoading: isJobLoading } = useGetJob(jobId);
  const { data: applicantStats } = useGetJobApplicantCount(jobId);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [appEmail, setAppEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  const { mutate: apply, isPending: isApplying } = useCreateApplication({
    mutation: {
      onSuccess: () => {
        setIsApplyModalOpen(false);
        setAppName(""); setAppEmail(""); setCoverLetter("");
        toast({ title: "Application Submitted!", description: "Your application was received. Track it in My Applications." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to submit. You may have already applied.", variant: "destructive" });
      }
    }
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    apply({ data: { jobId, applicantName: appName, applicantEmail: appEmail, coverLetter } });
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case "Full_time": return "Full Time";
      case "Part_time": return "Part Time";
      default: return shift;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "IT": return "IT Sector";
      case "NON_IT": return "Non-IT";
      case "STATE_GOVT": return "State Government";
      case "CENTRAL_GOVT": return "Central Government";
      default: return category.replace("_", " ");
    }
  };

  const steps = job?.applicationGuide?.split("\n").filter(s => s.trim()) ?? [];

  if (isJobLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }
  if (!job) {
    return <div className="text-center py-32 text-xl font-bold">Job not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      {/* Header */}
      <div className="bg-card rounded-3xl p-8 border border-border shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {getCategoryLabel(job.category)}
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Active Hiring
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                <Clock className="w-4 h-4" /> {getShiftLabel(job.shift)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Building2 className="w-5 h-5 text-primary" /> {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-primary/70" /> {job.location}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            {job.applicationLink && (
              <a
                href={job.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-60 px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" /> Apply on Official Portal
              </a>
            )}
            <button 
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full md:w-60 px-6 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border flex items-center justify-center gap-2"
            >
              Track My Application
            </button>
            <a 
              href={`mailto:${job.hrEmail}`}
              className="w-full md:w-60 px-6 py-3 rounded-xl font-semibold bg-card text-muted-foreground hover:bg-secondary flex items-center justify-center gap-2 transition-colors text-sm border border-border"
            >
              <Mail className="w-4 h-4 text-primary" /> Email HR
            </a>
          </div>
        </div>
      </div>

      {/* Key info strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> Salary / Package</span>
          <span className="font-bold text-foreground text-sm">{job.salary}</span>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Openings</span>
          <span className="font-bold text-foreground text-sm">{job.openings} Position{job.openings !== 1 ? "s" : ""}</span>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-500" /> Application Opens</span>
          <span className="font-bold text-emerald-600 text-sm">{formatDate(job.startDate)}</span>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-destructive" /> Last Date to Apply</span>
          <span className="font-bold text-destructive text-sm">{formatDate(job.endDate)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job Description */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> Job Description
            </h2>
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
            <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-foreground">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Work Type:</span>
                <span className="font-semibold text-foreground">{getShiftLabel(job.shift)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">HR Contact:</span>
                <a href={`mailto:${job.hrEmail}`} className="font-semibold text-primary hover:underline">{job.hrEmail}</a>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Package:</span>
                <span className="font-semibold text-foreground">{job.salary}</span>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Eligibility Criteria
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 text-sm leading-relaxed whitespace-pre-wrap">
              {job.eligibility}
            </div>
          </section>

          {/* Application Guide */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" /> Step-by-Step Application Guide
            </h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {step.replace(/^Step \d+:\s*/i, "")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Application timeline */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-display font-bold text-base border-b pb-3 mb-4">Application Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-0.5 shrink-0"></div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-semibold text-emerald-600">{formatDate(job.startDate)}</p>
                </div>
              </div>
              <div className="w-0.5 h-6 bg-border ml-1.25"></div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive mt-0.5 shrink-0"></div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Date</p>
                  <p className="font-semibold text-destructive">{formatDate(job.endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base border-b pb-3">Quick Info</h3>
            {[
              { label: "Salary", value: job.salary, icon: <IndianRupee className="w-4 h-4 text-primary" /> },
              { label: "Openings", value: `${job.openings} posts`, icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
              { label: "Location", value: job.location, icon: <MapPin className="w-4 h-4 text-blue-500" /> },
              { label: "Work Mode", value: getShiftLabel(job.shift), icon: <Clock className="w-4 h-4 text-purple-500" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">{icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-semibold text-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Applicant stats */}
          {applicantStats && (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-display font-bold text-base border-b pb-3 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Applicant Stats
              </h3>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-foreground">{applicantStats.total}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Applicants</p>
              </div>
              <div className="space-y-2">
                {Object.entries(applicantStats.byStatus).map(([status, count]) => (
                  count > 0 && (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold",
                        status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        status === "Reviewed" ? "bg-blue-100 text-blue-700" :
                        status === "Interview" ? "bg-purple-100 text-purple-700" :
                        status === "Offered" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      )}>{status}</span>
                      <span className="font-bold">{count as number}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Apply CTA */}
          {job.applicationLink && (
            <a
              href={job.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" /> Apply on Official Portal
            </a>
          )}
          <button 
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full px-6 py-3 rounded-xl font-bold border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Track My Application
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-display font-bold mb-1">Apply for {job.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{job.company} · {job.location} · {getShiftLabel(job.shift)}</p>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Full Name *</label>
                <input 
                  required type="text" value={appName}
                  onChange={e => setAppName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address *</label>
                <input 
                  required type="email" value={appEmail}
                  onChange={e => setAppEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                  placeholder="rahul@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Cover Letter (Optional)</label>
                <textarea 
                  value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[100px] resize-none text-sm"
                  placeholder="Tell us why you are a great fit for this role..."
                />
              </div>
              <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">HR Contact:</span> {job.hrEmail}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isApplying}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
