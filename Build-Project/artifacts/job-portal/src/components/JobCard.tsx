import { Link } from "wouter";
import { Building2, MapPin, Clock, IndianRupee, Users, ChevronRight, Calendar, Mail, ExternalLink } from "lucide-react";
import { Job, JobCategory } from "@workspace/api-client-react";
import { formatDate, cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  applicantCount?: number;
}

export function JobCard({ job, applicantCount }: JobCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case JobCategory.IT: return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case JobCategory.NON_IT: return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case JobCategory.STATE_GOVT: return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case JobCategory.CENTRAL_GOVT: return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "IT": return "IT Sector";
      case "NON_IT": return "Non-IT";
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

  return (
    <div className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium truncate">{job.company}</span>
          </div>
        </div>
        <span className={cn("px-2 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap shrink-0", getCategoryColor(job.category))}>
          {getCategoryLabel(job.category)}
        </span>
      </div>

      {/* Description snippet */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <span className="line-clamp-1">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <span className="font-medium">{getShiftLabel(job.shift)}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <IndianRupee className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <span className="font-semibold text-foreground">{job.salary}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <span><span className="font-medium text-foreground">{formatDate(job.startDate)}</span> → <span className="font-medium text-destructive">{formatDate(job.endDate)}</span></span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <span className="truncate text-primary font-medium">{job.hrEmail}</span>
        </div>
        {applicantCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span>{applicantCount} applied</span>
          </div>
        )}
      </div>

      {/* Openings badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
          {job.openings} Opening{job.openings !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-auto pt-4 border-t border-border flex items-center gap-2">
        {job.applicationLink && (
          <a
            href={job.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Official Portal
          </a>
        )}
        <Link 
          href={`/jobs/${job.id}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group/btn shadow-sm shadow-primary/20 ml-auto"
        >
          View Details
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
