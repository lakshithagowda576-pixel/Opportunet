import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetJob } from "@workspace/api-client-react";
import { createClient } from "@supabase/supabase-js";
import { 
  ArrowLeft, Loader2, Send, CheckCircle2, 
  Building2, MapPin, Briefcase, User, Mail, FileText, AlertCircle,
  Phone, MapPin as AddressIcon, BookOpen, Award, FileUp, CheckSquare, 
  ChevronRight, ChevronLeft, IndianRupee, Clock, Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
const RESUMES_BUCKET = "resumes";

interface ApplicationFormData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress: string;
  education: string;
  qualification: string;
  resumeUrl: string;
  acceptedTerms: boolean;
}

export default function ApplyPage() {
  const [, params] = useRoute("/jobs/:id/apply");
  const jobId = Number(params?.id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const [formData, setFormData] = useState<ApplicationFormData>({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    applicantAddress: "",
    education: "",
    qualification: "",
    resumeUrl: "",
    acceptedTerms: false,
  });

  useEffect(() => {
    if (user && !isAuthLoading) {
      setFormData(prev => ({
        ...prev,
        applicantName: user.name,
        applicantEmail: user.email,
      }));
    }
  }, [user, isAuthLoading]);

  const { data: job, isLoading: isJobLoading } = useGetJob(jobId);

  if (isAuthLoading || isJobLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Setting up your application environment...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 text-center shadow-xl shadow-amber-100">
          <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-amber-900 mb-2">Login Required</h1>
          <p className="text-amber-700 mb-6">You must be logged in to apply for jobs. Please sign in to continue.</p>
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

  if (!job) return <div className="text-center py-32 text-xl font-bold">Job not found.</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    const filePath = `resumes/job-${jobId}-${Date.now()}-${file.name}`;
    try {
      const { error } = await supabase.storage
        .from(RESUMES_BUCKET)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from(RESUMES_BUCKET).getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, resumeUrl: publicUrlData.publicUrl || "" }));
      toast({ title: "Resume uploaded", description: "Your resume was uploaded successfully." });
    } catch (error) {
      console.error("Resume upload failed:", error);
      toast({ title: "Upload failed", description: "Could not upload resume. Please try again.", variant: "destructive" });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1: return !!(formData.applicantName && formData.applicantEmail && formData.applicantPhone && formData.applicantAddress);
      case 2: return !!(formData.education && formData.qualification);
      case 3: return !!(formData.resumeUrl && formData.acceptedTerms);
      default: return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      toast({ title: "Missing Information", description: "Please complete all fields and accept terms.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          userId: user?.id,
          ...formData,
          coverLetter: "",
        }),
      });

      if (!response.ok) throw new Error("Application failed");
      
      const data = await response.json();
      setTrackingId(data.id);
      setSubmittedAt(new Date(data.appliedAt).toLocaleString());
      setIsSuccess(true);
      toast({ title: "Success!", description: "Application submitted successfully." });
    } catch (error) {
      toast({ title: "Submission Error", description: "Failed to submit application. You might have already applied.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-green-400 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200 rotate-3 hover:rotate-0 transition-transform duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-display font-black text-foreground mb-4">Application Sent!</h1>
        <p className="text-muted-foreground text-lg mb-8">You're one step closer to your new role at <span className="text-primary font-bold">{job.company}</span>.</p>
        
        <div className="glass-panel p-8 rounded-[2rem] border-primary/10 shadow-2xl mb-10 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <p className="text-xs uppercase tracking-widest text-primary font-black mb-6">Application Summary</p>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Tracking ID</span>
              <span className="font-mono font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">#{(trackingId || 0).toString().padStart(6, "0")}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Position</span>
              <span className="text-foreground font-bold">{job.title}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Applied On</span>
              <span className="text-foreground font-bold text-sm">{submittedAt}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate("/applications")} className="px-8 py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            Track My Applications
          </button>
          <button onClick={() => navigate("/jobs")} className="px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all">
            Browse More Jobs
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: "Personal", icon: User },
    { id: 2, name: "Academic", icon: BookOpen },
    { id: 3, name: "Review", icon: CheckSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="mb-8 flex items-center justify-between">
        <Link href={`/jobs/${jobId}`} className="group flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Job Details
        </Link>
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-secondary/50 rounded-full border border-border">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. time to apply: 2 minutes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Job Summary Sidebar (Sticky) */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-24 space-y-6">
            <div className="glass-panel p-6 rounded-[2rem] border-primary/10 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">You are applying for</p>
              <h1 className="text-2xl font-display font-black text-foreground mb-2 leading-tight">{job.title}</h1>
              <p className="flex items-center gap-2 text-muted-foreground font-bold text-sm mb-6">
                <Building2 className="w-4 h-4 text-primary" /> {job.company}
              </p>

              <div className="space-y-4 pt-6 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Location</p>
                    <p className="text-sm font-bold">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <IndianRupee className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Package</p>
                    <p className="text-sm font-bold">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Shift</p>
                    <p className="text-sm font-bold">{job.shift.replace("_", " ")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-xs text-primary font-bold leading-relaxed">
                  Tip: Make sure your professional summary highlights your {job.category} expertise.
                </p>
              </div>
            </div>

            {/* Step Indicators (Vertical on Desktop) */}
            <div className="hidden lg:block space-y-4 px-4">
              {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <div key={step.id} className="flex items-center gap-4 group">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all duration-300",
                      isActive ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : 
                      isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-secondary text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={cn(
                      "font-bold transition-all",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Application Form */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="glass-panel rounded-[2.5rem] border-primary/5 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
            {/* Horizontal Steps (Mobile Only) */}
            <div className="lg:hidden flex items-center justify-between p-6 bg-secondary/30 border-b border-border">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                    step.id === currentStep ? "bg-primary text-white" : 
                    step.id < currentStep ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {step.id < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{step.name}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h2 className="text-3xl font-display font-black text-foreground mb-2">Personal Information</h2>
                    <p className="text-muted-foreground">Let's start with your basic contact details.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          required name="applicantName" type="text" value={formData.applicantName} onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-inner-sm text-sm font-medium"
                          placeholder="Rahul Sharma"
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                      <div className="relative opacity-70">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          disabled value={formData.applicantEmail}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary border-2 border-transparent outline-none cursor-not-allowed text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          required name="applicantPhone" type="tel" value={formData.applicantPhone} onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-inner-sm text-sm font-medium"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Current City</label>
                      <div className="relative group">
                        <AddressIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          required name="applicantAddress" type="text" value={formData.applicantAddress} onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-inner-sm text-sm font-medium"
                          placeholder="e.g. Bangalore, KA"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Academic & Skills */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h2 className="text-3xl font-display font-black text-foreground mb-2">Qualifications</h2>
                    <p className="text-muted-foreground">Share your academic and professional milestones.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Highest Education Level</label>
                      <select 
                        required name="education" value={formData.education} onChange={handleInputChange}
                        className="w-full px-5 py-4 rounded-2xl bg-background border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-inner-sm text-sm font-bold appearance-none cursor-pointer"
                      >
                        <option value="">Select Education</option>
                        <option value="high-school">High School (10th/12th)</option>
                        <option value="diploma">Diploma</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">Ph.D.</option>
                      </select>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Skills & Certifications</label>
                      <textarea 
                        required name="qualification" value={formData.qualification} onChange={handleInputChange}
                        rows={6}
                        className="w-full px-5 py-4 rounded-2xl bg-background border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-inner-sm text-sm font-medium resize-none leading-relaxed"
                        placeholder="List your key skills (e.g. React, Node.js, SQL) and any certifications you hold."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Resume Upload */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h2 className="text-3xl font-display font-black text-foreground mb-2">Almost Done!</h2>
                    <p className="text-muted-foreground">Upload your latest resume to complete the application.</p>
                  </div>

                  <div className="space-y-6">
                    <div className={cn(
                      "relative group border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center gap-4 text-center cursor-pointer",
                      formData.resumeUrl ? "bg-emerald-50/50 border-emerald-200" : "bg-secondary/20 border-border hover:border-primary/40 hover:bg-primary/5"
                    )}>
                      <input 
                        required type="file" onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploadingResume}
                      />
                      
                      {isUploadingResume ? (
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="w-12 h-12 animate-spin text-primary" />
                          <p className="font-bold text-sm">Uploading your resume...</p>
                        </div>
                      ) : formData.resumeUrl ? (
                        <>
                          <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="font-black text-emerald-700">Resume Attached!</p>
                            <p className="text-xs text-emerald-600 mt-1">Click to replace with a different file</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-border group-hover:scale-110 transition-transform shadow-sm">
                            <FileUp className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-black text-foreground">Click to upload Resume</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, DOC or DOCX (Max 5MB)</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                          <input 
                            required type="checkbox" checked={formData.acceptedTerms} onChange={() => setFormData(p => ({...p, acceptedTerms: !p.acceptedTerms}))}
                            className="w-5 h-5 rounded border-2 border-primary/20 checked:bg-primary checked:border-primary transition-all cursor-pointer accent-primary"
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          I certify that the information provided is true and accurate. I understand that false information may lead to disqualification. I agree to <span className="text-primary underline">OpportuNet's Terms of Service</span>.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-border mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    if (currentStep > 1) setCurrentStep(currentStep - 1);
                    else navigate(`/jobs/${jobId}`);
                  }}
                  className="px-8 py-4 rounded-2xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
                >
                  <ChevronLeft className="w-4 h-4" /> {currentStep === 1 ? "Cancel" : "Back"}
                </button>
                
                {currentStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={() => {
                      if (validateStep(currentStep)) {
                        setCurrentStep(currentStep + 1);
                      } else {
                        toast({ title: "Wait!", description: "Please complete all fields to move forward.", variant: "destructive" });
                      }
                    }}
                    className="flex-1 px-8 py-4 rounded-2xl font-black bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    Continue to Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting || isUploadingResume || !formData.acceptedTerms}
                    className="flex-1 px-8 py-4 rounded-2xl font-black bg-emerald-600 text-white shadow-xl shadow-emerald-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 order-1 sm:order-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckSquare className="w-5 h-5" /> Submit Application</>}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
