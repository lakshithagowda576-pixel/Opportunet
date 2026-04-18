import { useState } from "react";
import { Link } from "wouter";
import { Building2, MapPin, Clock, IndianRupee, Users, ChevronRight, Calendar, Mail, ExternalLink, AlertCircle, CheckCircle2, Eye, ArrowRight, X } from "lucide-react";
import { Job, JobCategory } from "@workspace/api-client-react";
import { formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface JobCardProps {
  job: Job;
  applicantCount?: number;
}

import { motion } from "framer-motion";

export function JobCard({ job, applicantCount }: JobCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const externalApplyUrl = job.official_url || job.applicationLink;
  const hasExternalApply = !!externalApplyUrl && externalApplyUrl.startsWith("http");
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case JobCategory.IT: return "bg-blue-50 text-blue-600 border-blue-100";
      case JobCategory.NON_IT: return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case JobCategory.STATE_GOVT: return "bg-purple-50 text-purple-600 border-purple-100";
      case JobCategory.CENTRAL_GOVT: return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "IT": return "IT Sector";
      case "NON_IT": return "Corporate";
      case "STATE_GOVT": return "State Govt";
      case "CENTRAL_GOVT": return "Central Govt";
      default: return category.replace("_", " ");
    }
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case "Full_time": return "Full Time";
      case "Part_time": return "Part Time";
      default: return shift;
    }
  };

  const today = new Date();
  const start = new Date(job.startDate);
  const end = new Date(job.endDate);
  end.setHours(23, 59, 59, 999);

  const isClosed = today > end;
  const isFuture = today < start;
  const isOpen = !isClosed && !isFuture;

  const getStatusBadge = () => {
    if (isClosed) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] uppercase font-black text-red-600 bg-red-50/50 px-2 py-1 rounded-lg border border-red-100">
          <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse"></div> Closed
        </span>
      );
    }
    if (isFuture) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] uppercase font-black text-blue-600 bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100">
          <Calendar className="w-3 h-3" /> Opening Soon
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-[10px] uppercase font-black text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100">
        <div className="w-1 h-1 rounded-full bg-emerald-600 animate-ping"></div> Live Now
      </span>
    );
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className="group bg-white dark:bg-slate-900 rounded-[2rem] p-7 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 duration-700">
        <Briefcase className="w-24 h-24" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-5 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border", getCategoryColor(job.category))}>
                {getCategoryLabel(job.category)}
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="font-display font-black text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-[1.2]">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center p-1.5">
                <Building2 className="w-full h-full text-muted-foreground" />
              </div>
              <span className="text-sm font-bold truncate">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-6 leading-relaxed font-medium">
          {job.description}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/20">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Location</p>
              <p className="text-xs font-bold text-foreground truncate">{job.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/20">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Shift</p>
              <p className="text-xs font-bold text-foreground truncate">{getShiftLabel(job.shift)}</p>
            </div>
          </div>
          <div className="col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Estimated Package</p>
              <p className="text-lg font-black text-foreground">{job.salary}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-border/50 flex items-center gap-3">
          <button
            onClick={() => setShowDetails(true)}
            className="p-3 rounded-2xl bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-border/50"
          >
            <Eye className="w-5 h-5" />
          </button>

          {hasExternalApply ? (
            <a
              href={externalApplyUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black transition-all group/btn shadow-xl",
                isClosed
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:scale-[1.02] active:scale-95"
              )}
            >
              {isClosed ? "Closed" : isFuture ? "Register Interest" : "Quick Apply"}
              {!isClosed && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
            </a>
          ) : (
            <Link
              href={`/jobs/${job.id}/apply`}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black transition-all group/btn shadow-xl",
                isClosed
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:scale-[1.02] active:scale-95"
              )}
            >
              {isClosed ? "Closed" : isFuture ? "Register Interest" : "Quick Apply"}
              {!isClosed && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
            </Link>
          )}
        </div>
      </div>


      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-foreground">{job.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold">{job.company}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-blue-600 font-semibold">Location</div>
                <div className="text-sm text-blue-900 font-medium mt-1">{job.location}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xs text-green-600 font-semibold">Shift</div>
                <div className="text-sm text-green-900 font-medium mt-1">{getShiftLabel(job.shift)}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xs text-purple-600 font-semibold">Salary</div>
                <div className="text-sm text-purple-900 font-medium mt-1">{job.salary}</div>
              </div>
            </div>

            {/* Company Summary */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> About {job.company}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.company} is a leading organization committed to excellence and innovation. We foster a culture of continuous learning and professional growth for our team members.
              </p>
            </div>

            {/* Job Description */}
            <div>
              <h3 className="font-bold text-foreground mb-2">About the Role</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-blue-900 mb-3">Job Requirements</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Must meet the specified eligibility criteria</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Strong technical and communication skills</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Ability to work in a collaborative environment</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Commitment to professional development</span>
                </div>
              </div>
            </div>

            {/* Eligibility & Qualifications */}
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-amber-900 mb-2">Eligibility Criteria</h3>
                <p className="text-sm text-amber-900">{job.eligibility || "Candidates meeting the job requirements and company standards are eligible to apply."}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h3 className="font-bold text-orange-900 mb-2">Required Qualifications</h3>
                <p className="text-sm text-orange-900">Bachelor's degree in relevant field or equivalent professional experience. Industry-specific certifications preferred.</p>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Application Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-purple-900">Application Opens:</span>
                  <span className="font-semibold text-purple-700">{formatDate(job.startDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-900">Application Closes:</span>
                  <span className="font-semibold text-destructive">{formatDate(job.endDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-900">Total Openings:</span>
                  <span className="font-semibold text-purple-700">{job.openings}</span>
                </div>
              </div>
            </div>

            {/* Application Steps */}
            <div className="space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" /> How to Apply
              </h3>
              <div className="bg-gray-50 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <div className="font-semibold text-foreground">Click Apply Buttton</div>
                    <div className="text-sm text-muted-foreground mt-0.5">Start your application through the portal</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <div className="font-semibold text-foreground">Submit Your Details</div>
                    <div className="text-sm text-muted-foreground mt-0.5">Fill in your personal and professional information</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <div className="font-semibold text-foreground">Upload Documents</div>
                    <div className="text-sm text-muted-foreground mt-0.5">Provide resume, certifications, and required documents</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <div className="font-semibold text-foreground">Review & Submit</div>
                    <div className="text-sm text-muted-foreground mt-0.5">Verify your information and submit your application</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  <div>
                    <div className="font-semibold text-foreground">Track Status</div>
                    <div className="text-sm text-muted-foreground mt-0.5">Monitor your application status in the portal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button in Modal */}
            <div className="pt-4 border-t border-border">
              {hasExternalApply ? (
                <a
                  href={externalApplyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-bold transition-all shadow-lg",
                    isClosed
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 shadow-primary/30 hover:-translate-y-0.5"
                  )}
                >
                  {isClosed ? "Application Closed" : isFuture ? "Pre-Register Now" : "Apply Now"}
                  <ChevronRight className="w-5 h-5" />
                </a>
              ) : (
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-bold transition-all shadow-lg",
                    isClosed
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 shadow-primary/30 hover:-translate-y-0.5"
                  )}
                >
                  {isClosed ? "Application Closed" : isFuture ? "Pre-Register Now" : "Apply Now"}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
