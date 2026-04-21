import { useListApplications } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Briefcase, Building2, CheckCircle2, Clock, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STEPS = ["Pending", "Reviewed", "Interview", "Offered"];

export default function ApplicationTracker() {
  const { data: applications, isLoading } = useListApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Reviewed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'Interview': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'Offered': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'Rejected': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
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

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
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
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStepIdx = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div key={app.id} className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-border pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5", getStatusColor(app.status))}>
                        {getStatusIcon(app.status)} {app.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Applied {format(new Date(app.appliedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                      <Link href={`/jobs/${app.jobId}`}>
                        {app.job?.title || "Unknown Position"}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4" /> {app.job?.company || "Unknown Company"}
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center">
                    <Link href={`/jobs/${app.jobId}`} className="text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                      View Listing <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="relative pt-2">
                  {isRejected ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-800">Application Rejected</h4>
                        <p className="text-sm text-red-600 mt-1">Unfortunately, the employer has decided to move forward with other candidates for this position.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between relative">
                      {/* Connecting Line Background */}
                      <div className="absolute top-4 left-0 w-full h-1 bg-secondary -z-10 rounded-full"></div>
                      
                      {/* Connecting Line Active */}
                      <div 
                        className="absolute top-4 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-1000"
                        style={{ width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 100}%` }}
                      ></div>

                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        
                        return (
                          <div key={step} className="flex flex-col items-center gap-2 z-10 w-1/4">
                            <div className={cn(
                              "w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors duration-500",
                              isCompleted ? "bg-primary border-primary text-white shadow-lg shadow-primary/40" : "bg-card border-secondary text-transparent"
                            )}>
                              {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <span className={cn(
                              "text-xs font-semibold px-2 text-center",
                              isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
