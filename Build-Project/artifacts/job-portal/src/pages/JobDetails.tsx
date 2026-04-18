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
  Loader2, ArrowLeft, Mail, BookOpen, ListChecks, Briefcase, ExternalLink, Send, X, GraduationCap
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";

export default function JobDetails() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = Number(params?.id);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: job, isLoading: isJobLoading } = useGetJob(jobId);
  const { data: applicantStats } = useGetJobApplicantCount(jobId);
  const { isLoading: isAuthLoading } = useAuth();

  const [hasApplied, setHasApplied] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  const canApply = user && new Date() <= new Date(job?.endDate || new Date());

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
  const externalApplyUrl = job?.official_url || job?.applicationLink || "";

  if (isJobLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }
  if (!job) {
    return <div className="text-center py-32 text-xl font-bold">Job not found.</div>;
  }

  return (
    <>
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
              {new Date() > new Date(job.endDate) ? (
                 <span className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200">
                    <AlertCircle className="w-4 h-4" /> Application Closed
                 </span>
              ) : new Date() < new Date(job.startDate) ? (
                 <span className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                    <Calendar className="w-4 h-4" /> Application Opens {format(new Date(job.startDate), "MMMM d, yyyy")}
                 </span>
              ) : (
                 <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Accepting Applications
                 </span>
              )}
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
            {hasApplied && (
               <div className="w-full md:w-60 bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center animate-in zoom-in-95 duration-500 shadow-lg shadow-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="text-emerald-700 font-bold">Applied Successfully!</p>
                  <p className="text-emerald-600 text-xs mt-1">HR will be notified shortly.</p>
               </div>
            )}
            {!hasApplied && (
               user ? (
                 <Link 
                   href={`/jobs/${jobId}/apply`}
                   className={`w-full md:w-60 px-6 py-4 rounded-xl font-bold text-lg text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                     canApply
                       ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1'
                       : 'bg-muted text-muted-foreground cursor-not-allowed'
                   }`}
                 >
                   <Send className="w-4 h-4" /> {canApply ? 'Apply Now' : 'Application Closed'}
                 </Link>
               ) : (
                 <Link 
                   href="/login"
                   className="w-full md:w-60 px-6 py-4 rounded-xl font-bold text-lg text-center bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                 >
                   <Send className="w-4 h-4" /> Sign In to Apply
                 </Link>
               )
            )}
            {!hasApplied && externalApplyUrl && (
               <button
                 onClick={() => setShowRedirectModal(true)}
                 className="w-full md:w-60 px-6 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border flex items-center justify-center gap-2"
               >
                 <ExternalLink className="w-4 h-4" /> Apply on Official Portal
               </button>
            )}
            {!hasApplied && (
               <>
                 <Link 
                   href="/applications"
                   className="w-full md:w-60 px-6 py-3 rounded-xl font-semibold bg-card text-muted-foreground hover:bg-secondary flex items-center justify-center gap-2 transition-colors text-sm border border-border"
                 >
                   Track Applications
                 </Link>
                 <Link 
                   href={`/jobs/${jobId}/applications`}
                   className="w-full md:w-60 px-6 py-3 rounded-xl font-semibold bg-card text-muted-foreground hover:bg-secondary flex items-center justify-center gap-2 transition-colors text-sm border border-border"
                 >
                   <Users className="w-4 h-4" /> View Applicants
                 </Link>
               </>
            )}
            {hasApplied && (
               <Link 
                 href={`/jobs/${jobId}/applications`}
                 className="w-full md:w-60 px-6 py-3 rounded-xl font-semibold bg-card text-muted-foreground hover:bg-secondary flex items-center justify-center gap-2 transition-colors text-sm border border-border"
               >
                 <Users className="w-4 h-4" /> View More Applicants
               </Link>
            )}
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

          {/* Company Summary */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> About {job.company}
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {job.company} is a leading organization committed to excellence and innovation. We are looking for talented individuals to join our growing team and contribute to our success.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Industry</p>
                  <p className="text-sm font-bold mt-1">{getCategoryLabel(job.category)}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Locations</p>
                  <p className="text-sm font-bold mt-1">{job.location}</p>
                </div>
              </div>
            </div>
          </section>





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

          {/* Job Requirements */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" /> Job Requirements
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-blue-900 space-y-3">
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {job.description}
              </div>
              <div className="border-t border-blue-300 pt-4 mt-4">
                <p className="text-xs font-bold text-blue-700 mb-3">KEY REQUIREMENTS:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    <span>Must meet the eligibility criteria mentioned below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    <span>Valid educational qualifications as specified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    <span>Required experience in the relevant field</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    <span>Strong communication and problem-solving skills</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Eligibility - Qualifications */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Eligibility & Qualifications
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm mb-3 text-foreground">Eligibility Criteria:</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 text-sm leading-relaxed whitespace-pre-wrap">
                  {job.eligibility}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3 text-foreground">Preferred Qualifications:</h3>
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-2">
                  <div className="text-green-900 text-sm space-y-2">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>Bachelor's degree in relevant field</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>0-3 years of relevant experience</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>Proficiency in relevant tools and technologies</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>Strong analytical and communication abilities</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Application Guide */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" /> How to Apply - Step by Step Guide
            </h2>
            <div className="space-y-3">
              {steps.length > 0 ? (
                steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start bg-secondary/30 p-4 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                      {step.replace(/^Step \d+:\s*/i, "")}
                    </p>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3 items-start bg-secondary/30 p-4 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">Visit the official portal link or use the "Apply in Portal" button below</p>
                  </div>
                  <div className="flex gap-3 items-start bg-secondary/30 p-4 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">Click on "Apply Now" or create your account if you're a new user</p>
                  </div>
                  <div className="flex gap-3 items-start bg-secondary/30 p-4 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">Fill in the application form with accurate details</p>
                  </div>
                  <div className="flex gap-3 items-start bg-secondary/30 p-4 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">4</div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">Upload required documents and certificate copies</p>
                  </div>
                  <div className="flex gap-3 items-start bg-secondary/30 p-4 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">5</div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">Review and submit your application before the deadline</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-900">
                <span className="font-semibold">Important:</span> Make sure to submit your application before {formatDate(job.endDate)}. Late submissions will not be accepted.
              </p>
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

        </div>
      </div>

      {/* Redirect / Application Guide Modal */}
      {showRedirectModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-primary/20">
            <button 
              onClick={() => setShowRedirectModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8 md:p-12">
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-foreground">Official Application</h3>
                  <p className="text-muted-foreground font-medium">You are applying for <span className="text-primary font-bold">{job.title}</span> at <span className="font-bold">{job.company}</span>.</p>
                </div>

                <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <ListChecks className="w-4 h-4" /> How to Apply Correctly
                  </h4>
                  <div className="space-y-3">
                    {steps.length > 0 ? steps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-foreground font-medium leading-relaxed">
                          {step.replace(/^Step \d+:\s*/i, "")}
                        </p>
                      </div>
                    )) : (
                      <>
                        <div className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                          <p className="text-sm text-foreground font-medium leading-relaxed">Click the button below to open the official career portal.</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                          <p className="text-sm text-foreground font-medium leading-relaxed">Locate the search or "Job ID" section and enter the details if required.</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                          <p className="text-sm text-foreground font-medium leading-relaxed">Complete the application form and upload your updated resume.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2">Checklist</h4>
                    <ul className="text-xs text-blue-900 space-y-2 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" /> Updated Resume (PDF)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" /> Portfolio / LinkedIn Link
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" /> Academic Certificates
                      </li>
                    </ul>
                  </div>
                  <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-2">HR Tip</h4>
                    <p className="text-xs text-purple-900 leading-relaxed font-medium">
                      Ensure your contact details match your OpportuNet profile for faster tracking by the recruitment team.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <a 
                    href={`${externalApplyUrl}${externalApplyUrl.includes('?') ? '&' : '?'}jobId=${jobId}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setShowRedirectModal(false)}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-center shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    Go to Company Career Portal <ExternalLink className="w-5 h-5" />
                  </a>
                  <p className="text-[10px] text-center text-muted-foreground">
                    You are now leaving OpportuNet to apply on the official company website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
