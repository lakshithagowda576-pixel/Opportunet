import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  useListJobs, 
  useListApplications, 
  useListMessages 
} from "@workspace/api-client-react";
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { JobCard } from "@/components/JobCard";

export default function Dashboard() {
  const { data: jobs, isLoading: isJobsLoading } = useListJobs();
  const { data: applications, isLoading: isAppsLoading } = useListApplications();
  const { data: messages, isLoading: isMessagesLoading } = useListMessages();

  const stats = [
    { 
      label: "Available Positions", 
      value: jobs?.length || 0, 
      icon: Briefcase, 
      trend: "+12% this week",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    { 
      label: "My Applications", 
      value: applications?.length || 0, 
      icon: FileText, 
      trend: `${applications?.filter(a => a.status === 'Offered').length || 0} offers`,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    { 
      label: "Pending Reviews", 
      value: applications?.filter(a => a.status === 'Pending' || a.status === 'Reviewed').length || 0, 
      icon: TrendingUp, 
      trend: "Awaiting HR",
      color: "text-amber-600",
      bg: "bg-amber-100"
    },
    { 
      label: "Unread Messages", 
      value: messages?.filter(m => m.isReply).length || 0, 
      icon: MessageSquare, 
      trend: "From Recruiters",
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
  ];

  if (isJobsLoading || isAppsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-primary shadow-2xl shadow-primary/20"
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-primary-foreground space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight">
              Advance your career in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-100">
                Government & Corporate
              </span> sectors.
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-xl">
              One central hub for IT, Non-IT, KPSC, SSC exams and premium job listings. Track your applications and communicate directly with HR.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/jobs" className="px-6 py-3 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Browse Jobs
              </Link>
              <Link href="/exams" className="px-6 py-3 rounded-xl bg-primary-foreground/10 text-primary-foreground font-bold hover:bg-primary-foreground/20 backdrop-blur-sm transition-all duration-200 border border-primary-foreground/20">
                PG-CET Resources
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={stat.label} 
            className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-display font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Recent Jobs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
            Featured Opportunities
          </h2>
          <Link href="/jobs" className="text-primary font-semibold hover:underline flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.slice(0, 6).map((job, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={job.id}
            >
              <JobCard job={job} />
            </motion.div>
          ))}
          {jobs?.length === 0 && (
            <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No jobs available right now.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
