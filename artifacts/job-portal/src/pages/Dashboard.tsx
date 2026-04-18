import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  useListJobs, 
  useListApplications
} from "@workspace/api-client-react";
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  Loader2,
  Building2,
  GraduationCap
} from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Dashboard() {
  const { data: jobs, isLoading: isJobsLoading } = useListJobs();
  const { data: applications, isLoading: isAppsLoading } = useListApplications();
  const { data: appSummary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["applicationSummary"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/applications/summary`, { credentials: "include" });
      if (!res.ok) return { total: 0, byStatus: {}, byCategory: {} };
      return res.json();
    },
  });

  if (isJobsLoading || isAppsLoading || isSummaryLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  // Filter jobs by sector
  const itJobs = jobs?.filter(j => j.category === "IT").slice(0, 3) || [];
  const nonItJobs = jobs?.filter(j => j.category === "NON_IT").slice(0, 3) || [];
  const stateGovtJobs = jobs?.filter(j => j.category === "STATE_GOVT").slice(0, 3) || [];
  const centralGovtJobs = jobs?.filter(j => j.category === "CENTRAL_GOVT").slice(0, 3) || [];

  const stats = [
    { 
      label: "Active Roles", 
      value: jobs?.length || 0, 
      icon: Briefcase, 
      trend: "Verified Today",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Your Submissions", 
      value: appSummary?.total ?? applications?.length ?? 0, 
      icon: FileText, 
      trend: `${appSummary?.byStatus?.Offered || 0} Successful`,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      label: "In Review", 
      value: (appSummary?.byStatus?.Pending || 0) + (appSummary?.byStatus?.Reviewed || 0), 
      icon: TrendingUp, 
      trend: "Tracking Live",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    { 
      label: "Sectors Covered", 
      value: "04", 
      icon: LayoutDashboard, 
      trend: "State & Central",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const SectionHeader = ({ title, link, icon: Icon, color }: { title: string, link: string, icon: any, color: string }) => (
    <div className="flex items-center justify-between mb-8 group">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 duration-500", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-black text-foreground">
            {title}
          </h2>
          <div className="h-1 w-12 bg-primary/20 rounded-full mt-1 group-hover:w-24 transition-all duration-500"></div>
        </div>
      </div>
      <Link href={link} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-sm font-black hover:bg-primary hover:text-white transition-all group-hover:shadow-lg">
        Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 pb-20"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="relative rounded-[3rem] overflow-hidden bg-slate-950 min-h-[450px] flex items-center group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-950 to-accent/20 z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>
        
        <div className="relative z-20 p-8 md:p-16 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-white/70"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" /> India's Most Unified Portal
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-none text-white">
              Bridge to Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-accent">
                Professional Future.
              </span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl font-medium leading-relaxed">
              OpportuNet simplifies your career journey across IT sectors, Corporate roles, and Government examinations with real-time tracking and guided applications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/jobs" className="px-8 py-4 rounded-2xl bg-primary text-white font-black shadow-2xl shadow-primary/40 hover:scale-105 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
                Browse Directory <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/exams" className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
                PG-CET Hub <GraduationCap className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block flex-1 relative">
             <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-[3rem] rotate-6 opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 bg-slate-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden group-hover:rotate-0 transition-transform duration-700">
                    <div className="space-y-6">
                       {[1,2,3].map(i => (
                         <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                               <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 h-2 bg-white/10 rounded-full"></div>
                            <div className="w-12 h-2 bg-primary/40 rounded-full"></div>
                         </div>
                       ))}
                    </div>
                </div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div 
            variants={itemVariants}
            key={stat.label} 
            className="group bg-card hover:bg-white rounded-[2.5rem] p-8 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <h3 className="text-4xl font-display font-black text-foreground mb-1 tracking-tighter">
              {stat.value}
            </h3>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
            <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{stat.trend}</span>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* IT Sector */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title="Technology & IT" 
            link="/jobs?category=IT" 
            icon={Briefcase} 
            color="bg-blue-600 text-white shadow-blue-200" 
          />
          <div className="grid grid-cols-1 gap-6">
            {itJobs.map(job => <JobCard key={job.id} job={job} />)}
            {itJobs.length === 0 && <p className="text-muted-foreground italic text-center py-10 bg-secondary/20 rounded-3xl border border-dashed border-border">No IT roles currently featured.</p>}
          </div>
        </motion.section>

        {/* Corporate */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title="Corporate & Non-IT" 
            link="/jobs?category=NON_IT" 
            icon={Building2} 
            color="bg-emerald-600 text-white shadow-emerald-200" 
          />
          <div className="grid grid-cols-1 gap-6">
            {nonItJobs.map(job => <JobCard key={job.id} job={job} />)}
            {nonItJobs.length === 0 && <p className="text-muted-foreground italic text-center py-10 bg-secondary/20 rounded-3xl border border-dashed border-border">No Corporate roles featured.</p>}
          </div>
        </motion.section>

        {/* State Govt */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title="State Government" 
            link="/jobs?category=STATE_GOVT" 
            icon={FileText} 
            color="bg-purple-600 text-white shadow-purple-200" 
          />
          <div className="grid grid-cols-1 gap-6">
            {stateGovtJobs.map(job => <JobCard key={job.id} job={job} />)}
            {stateGovtJobs.length === 0 && <p className="text-muted-foreground italic text-center py-10 bg-secondary/20 rounded-3xl border border-dashed border-border">No State Govt roles featured.</p>}
          </div>
        </motion.section>

        {/* Central Govt */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title="Central Government" 
            link="/jobs?category=CENTRAL_GOVT" 
            icon={TrendingUp} 
            color="bg-amber-600 text-white shadow-amber-200" 
          />
          <div className="grid grid-cols-1 gap-6">
            {centralGovtJobs.map(job => <JobCard key={job.id} job={job} />)}
            {centralGovtJobs.length === 0 && <p className="text-muted-foreground italic text-center py-10 bg-secondary/20 rounded-3xl border border-dashed border-border">No Central Govt roles featured.</p>}
          </div>
        </motion.section>

      </div>

      {/* PG-CET CTA */}
      <motion.section 
        variants={itemVariants}
        className="relative bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-primary to-accent rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
            <GraduationCap className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2 tracking-tighter">Academic Excellence Hub</h2>
            <p className="text-white/50 max-w-md font-medium">Ace your PG-CET 2026 with curated study materials, real-time exam tracking, and application assistance.</p>
          </div>
        </div>
        <Link href="/exams" className="relative z-10 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black shadow-2xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-3 group/btn">
          Access Hub <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
        </Link>
      </motion.section>
    </motion.div>
  );
}
