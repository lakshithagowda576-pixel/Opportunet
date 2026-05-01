import { useListExams, useListStudyMaterials } from "@workspace/api-client-react";
import { 
  GraduationCap, ExternalLink, CalendarDays, FileText, Video, 
  BookOpen, FlaskConical, CheckCircle2, ArrowRight, Loader2, ListChecks, Info, Search,
  PlayCircle, Download, X, AlertTriangle, MonitorPlay, Sparkles
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PgCetHub() {
  const { data: exams, isLoading: isExamsLoading } = useListExams();
  const { data: materials, isLoading: isMaterialsLoading } = useListStudyMaterials();
  const [selectedExam, setSelectedExam] = useState<number | "all">("all");
  const [activeMaterial, setActiveMaterial] = useState<any>(null);
  const [redirectExam, setRedirectExam] = useState<any>(null);

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-rose-500" />;
      case 'Video': return <Video className="w-5 h-5 text-sky-500" />;
      case 'Notes': return <BookOpen className="w-5 h-5 text-amber-500" />;
      case 'Practice_Test': return <FlaskConical className="w-5 h-5 text-indigo-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getMaterialBadgeColor = (type: string) => {
    switch (type) {
      case 'PDF': return "bg-rose-50 text-rose-700 border-rose-200";
      case 'Video': return "bg-sky-50 text-sky-700 border-sky-200";
      case 'Notes': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'Practice_Test': return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    if (url.includes('youtube.com/playlist?list=')) {
      const listId = url.split('list=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/videoseries?list=${listId}`;
    }
    return url;
  };

  const getYouTubeThumbnail = (url: string) => {
    if (!isYouTubeUrl(url)) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    // For playlists, we use a generic preparation thumbnail or the first video if known
    return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop";
  };

  const filteredMaterials = selectedExam === "all"
    ? materials
    : materials?.filter(m => m.examId === selectedExam);


  if (isExamsLoading || isMaterialsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <GraduationCap className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Resources...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-24 pb-32"
    >
      {/* Hero Section */}
      <motion.div 
        variants={itemVariants}
        className="relative rounded-[4rem] overflow-hidden bg-slate-950 py-24 px-8 sm:px-12 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-slate-950 to-accent/30 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[150px] animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-20 space-y-10 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-2xl"
          >
            Future-Ready Preparation
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter">
            Conquer <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-accent">PG-CET 2026</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            The ultimate academic command center for Karnataka's post-graduate aspirants. Integrated materials, official trackers, and expert guides.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <a href="#materials" className="px-10 py-5 rounded-[2rem] bg-primary text-white font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
              Launch Library
            </a>
            <Link href="/exams/result-finder" className="px-10 py-5 rounded-[2rem] bg-white/5 text-white font-black backdrop-blur-3xl border border-white/10 hover:bg-white/10 transition-all">
              Result Finder
            </Link>
          </div>
        </div>
      </motion.div>


      {/* Exam Timeline / Application Guide */}
      <motion.section variants={itemVariants} className="space-y-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl font-display font-black text-foreground tracking-tight">Examination Roadmap</h2>
            <p className="text-muted-foreground font-medium">Critical milestones and submission checklists for 2026.</p>
          </div>
        </div>

        <div className="space-y-16">
          {exams?.map((exam) => {
            const steps = exam.applicationGuide?.split("\n").filter(s => s.trim()) ?? [];
            return (
              <motion.div 
                whileHover={{ boxShadow: "0 30px 60px -12px rgba(0,0,0,0.12)" }}
                key={exam.id} 
                className="bg-card rounded-[4rem] border border-border/50 overflow-hidden group transition-all duration-500"
              >
                {/* Header */}
                <div className="bg-slate-950 p-10 md:p-16 text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-50"></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                    <div className="space-y-4">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        Official Entrance Exam
                      </div>
                      <h3 className="text-4xl md:text-6xl font-display font-black tracking-tighter">{exam.fullName}</h3>
                      <p className="text-slate-400 max-w-3xl leading-relaxed text-lg font-medium">{exam.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
                      <Link href={`/exams/${exam.id}/apply`} className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3">
                         <CheckCircle2 className="w-5 h-5" /> Register & Track
                      </Link>
                      <a href={exam.applyLink} target="_blank" rel="noreferrer" className="px-10 py-5 bg-white/5 text-white border border-white/10 backdrop-blur-3xl rounded-[2rem] font-black hover:bg-white/10 transition-all text-center flex items-center justify-center gap-2">
                        Official Portal <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-10 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* Left: Dates & Steps */}
                  <div className="lg:col-span-8 space-y-12">
                    {/* Important Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-8 text-center hover:bg-emerald-50 transition-colors">
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-3">Portal Opens</p>
                        <p className="font-black text-emerald-900 text-2xl tracking-tighter">{formatDate(exam.applicationStartDate)}</p>
                      </div>
                      <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-8 text-center hover:bg-rose-50 transition-colors">
                        <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest mb-3">Closing Deadline</p>
                        <p className="font-black text-rose-900 text-2xl tracking-tighter">{formatDate(exam.applicationEndDate)}</p>
                      </div>
                      <div className="bg-sky-50/50 border border-sky-100 rounded-[2.5rem] p-8 text-center hover:bg-sky-50 transition-colors">
                        <p className="text-[10px] text-sky-600 font-black uppercase tracking-widest mb-3">Exam Session</p>
                        <p className="font-black text-sky-900 text-2xl tracking-tighter">{formatDate(exam.examDate)}</p>
                      </div>
                    </div>

                    {/* How to Apply */}
                    <div className="space-y-8">
                      <h4 className="text-2xl font-display font-black text-foreground flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <ListChecks className="w-6 h-6" />
                        </div>
                        Application Protocol
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {steps.map((step, i) => (
                          <div key={i} className="group/step flex gap-5 p-6 rounded-[2rem] bg-secondary/30 border border-border/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shrink-0 group-hover/step:bg-primary group-hover/step:rotate-12 transition-all">
                              {i + 1}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pt-1 font-bold">
                              {step.replace(/^Step \d+:\s*/i, "")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Eligibility */}
                  <div className="lg:col-span-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-[3rem] p-10 h-full relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                      <h4 className="text-2xl font-display font-black text-indigo-900 mb-8 flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        Eligibility
                      </h4>
                      <p className="text-base text-indigo-800 leading-relaxed whitespace-pre-wrap relative z-10 font-black flex-1">
                        {exam.eligibility}
                      </p>
                      <div className="mt-12 p-6 bg-white rounded-[2rem] border border-indigo-200 relative z-10 shadow-sm">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Primary Domain</p>
                        <a href={exam.officialWebsite} target="_blank" rel="noreferrer" className="text-sm font-black text-indigo-900 flex items-center gap-2 hover:text-primary transition-colors">
                          {exam.officialWebsite.replace('https://', '')} <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Study Materials Repository */}
      <motion.section variants={itemVariants} id="materials" className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-display font-black text-foreground tracking-tight">Resource Command</h2>
              <p className="text-muted-foreground font-medium">Curated repository of elite preparation assets.</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap bg-secondary/80 p-2 rounded-[2rem] border border-border/50 backdrop-blur-xl">
            <button
              onClick={() => setSelectedExam("all")}
              className={cn(
                "px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                selectedExam === "all" ? "bg-white text-primary shadow-xl" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Master Set
            </button>
            {exams?.map(exam => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam.id)}
                className={cn(
                  "px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                  selectedExam === exam.id ? "bg-white text-primary shadow-xl" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {exam.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredMaterials?.map((mat) => {
              const isVideo = mat.type === 'Video';
              const isYT = isVideo && isYouTubeUrl(mat.url);
              const thumb = isYT ? getYouTubeThumbnail(mat.url) : null;

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={mat.id}
                  className="group flex flex-col bg-card rounded-[3rem] border border-border/50 hover:border-primary/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden"
                >
                  {/* Media Section */}
                  {isVideo && isYT ? (
                    <div className="relative aspect-video overflow-hidden">
                      <img src={thumb!} alt={mat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <button 
                          onClick={() => setActiveMaterial(mat)}
                          className="w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500"
                        >
                          <PlayCircle className="w-12 h-12 fill-primary text-white" />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                        Video Intelligence
                      </div>
                    </div>
                  ) : (
                    <div className={cn(
                      "relative aspect-video flex items-center justify-center",
                      mat.type === 'PDF' ? "bg-rose-50/50" : mat.type === 'Notes' ? "bg-amber-50/50" : "bg-indigo-50/50"
                    )}>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
                          {getMaterialIcon(mat.type)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-black text-foreground text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {mat.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                        {mat.description}
                      </p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-secondary rounded-full border border-border/50 text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                        {mat.subject}
                      </span>
                      <button 
                        onClick={() => setActiveMaterial(mat)}
                        className="inline-flex items-center gap-2 text-sm font-black text-primary hover:translate-x-1 transition-transform"
                      >
                        {mat.type === 'PDF' ? <Download className="w-4 h-4" /> : <Search className="w-4 h-4" />} Access
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredMaterials?.length === 0 && (
          <div className="text-center py-32 bg-secondary/20 rounded-[4rem] border-2 border-dashed border-border/50">
            <BookOpen className="w-24 h-24 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-2xl font-black text-muted-foreground tracking-tight">Archives Empty</h3>
            <p className="text-muted-foreground font-medium">We're indexing more resources for this category.</p>
          </div>
        )}
      </motion.section>

      {/* College Finder Banner */}
      <motion.section 
        variants={itemVariants}
        className="relative rounded-[4rem] overflow-hidden bg-slate-950 p-12 md:p-24 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-950 to-slate-950 z-10"></div>
        <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
           <div className="absolute -right-20 -top-20 w-full h-full bg-primary rounded-full blur-[150px] animate-pulse"></div>
        </div>
        
        <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-3xl space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Smart Matching Algorithm
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter">Your Future <br /> College, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Found.</span></h2>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              Plug in your PG-CET ranking and let our intelligence engine map you to the best-fit institutions in Karnataka. Instant cutoffs, verified fee data.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/exams/result-finder" className="px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all">
                Run Simulation
              </Link>
              <a href="https://kea.kar.nic.in/results" target="_blank" rel="noreferrer" className="px-12 py-5 bg-white/5 text-white border border-white/10 backdrop-blur-3xl rounded-[2rem] font-black hover:bg-white/10 transition-all">
                Check Rankings
              </a>
            </div>
          </div>
          <div className="relative w-48 h-48 md:w-80 md:h-80 shrink-0">
             <div className="absolute inset-0 bg-primary/20 rounded-[4rem] rotate-12 animate-pulse"></div>
             <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-0 transition-transform duration-700">
                <GraduationCap className="w-24 h-24 md:w-40 md:h-40 text-primary opacity-50" />
             </div>
          </div>
        </div>
      </motion.section>

      {/* Material Modal Viewer */}
      <AnimatePresence>
        {activeMaterial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl bg-card rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5"
            >
              <button 
                onClick={() => setActiveMaterial(null)}
                className="absolute top-10 right-10 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-colors z-20 border border-white/5"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[600px]">
                <div className="lg:col-span-8 bg-black flex items-center justify-center overflow-hidden">
                  {activeMaterial.type === 'Video' ? (
                    isYouTubeUrl(activeMaterial.url) ? (
                      <iframe 
                        src={getYouTubeEmbedUrl(activeMaterial.url)}
                        className="w-full aspect-video"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    ) : (
                      <div className="text-center p-16 space-y-8">
                        <AlertTriangle className="w-24 h-24 text-amber-500 mx-auto" />
                        <h4 className="text-3xl font-black text-white">Digital Access Restricted</h4>
                        <p className="text-slate-400 max-w-md mx-auto text-lg">This secured resource must be accessed via the primary academic node.</p>
                        <a 
                          href={activeMaterial.url} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[2rem] font-black shadow-2xl shadow-primary/40"
                        >
                          Launch Externally <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-20 space-y-10">
                      <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mx-auto rotate-3 group-hover:rotate-0 transition-transform duration-700">
                        {getMaterialIcon(activeMaterial.type)}
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black text-white">{activeMaterial.title}</h3>
                        <p className="text-slate-400 max-w-xl mx-auto text-xl">{activeMaterial.description}</p>
                      </div>
                      <div className="flex gap-6 justify-center">
                        <a 
                          href={activeMaterial.url} target="_blank" rel="noreferrer"
                          className="px-12 py-6 bg-primary text-white rounded-[2rem] font-black shadow-2xl shadow-primary/40 flex items-center gap-3 hover:scale-105 transition-all"
                        >
                          {activeMaterial.type === 'PDF' ? 'Download Assets' : 
                           activeMaterial.type === 'Practice_Test' ? 'Start Test Challenge' : 'Open Resource'} 
                          {activeMaterial.type === 'Practice_Test' ? <FlaskConical className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-4 p-12 bg-card flex flex-col justify-between border-l border-white/5">
                  <div className="space-y-10">
                    <span className={cn("inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border", getMaterialBadgeColor(activeMaterial.type))}>
                      {activeMaterial.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-4xl font-display font-black leading-tight tracking-tighter">{activeMaterial.title}</h3>
                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-secondary/50 border border-border/50">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Academic Subject</p>
                        <p className="font-black text-xl text-foreground">{activeMaterial.subject}</p>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed font-medium italic">
                        "{activeMaterial.description}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-10 border-t border-border/50">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30">
                       <Info className="w-6 h-6 text-primary shrink-0" />
                       <p className="text-xs text-muted-foreground font-bold">
                        Academic Notice: Resources are indexed from verified open-access repositories (NPTEL, GeeksforGeeks).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redirect / Application Guide Modal */}
      <AnimatePresence>
        {redirectExam && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-3xl bg-card rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] overflow-hidden border border-white/5"
            >
              <button 
                onClick={() => setRedirectExam(null)}
                className="absolute top-10 right-10 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-colors z-20 border border-white/5"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-12 md:p-20">
                <div className="space-y-12">
                  <div className="space-y-4 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                    <h3 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tighter">{redirectExam.name} Protocol</h3>
                    <p className="text-muted-foreground text-lg font-medium">Follow the verified sequence on the official government portal.</p>
                  </div>

                  <div className="bg-primary/5 rounded-[3rem] p-10 border border-primary/10">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                      <ListChecks className="w-5 h-5" /> Operational Checklist
                    </h4>
                    <div className="space-y-6">
                      {redirectExam.applicationGuide?.split("\n").filter((s: string) => s.trim()).map((step: string, i: number) => (
                        <div key={i} className="flex gap-6 group">
                          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all">
                            {i + 1}
                          </div>
                          <p className="text-base text-foreground font-black leading-relaxed">
                            {step.replace(/^Step \d+:\s*/i, "")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-amber-50/50 rounded-[2rem] p-8 border border-amber-100/50">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4">Required Assets</h4>
                      <ul className="text-sm text-amber-900 space-y-3 font-black">
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-amber-500" /> Digital Photograph
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-amber-500" /> Verified Signature
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-amber-500" /> Academic Credentials
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-amber-500" /> Domicile Proofs
                        </li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100/50">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4">Success Strategy</h4>
                      <p className="text-sm text-emerald-900 leading-relaxed font-black">
                        Cache your Application Number immediately. It serves as your primary key for hall tickets and final rankings.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col gap-4">
                    <a 
                      href={redirectExam.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setRedirectExam(null)}
                      className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-center shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      Initialize Official Session <ExternalLink className="w-6 h-6" />
                    </a>
                    <p className="text-[10px] text-center text-muted-foreground font-black tracking-widest uppercase">
                      Redirecting to Secured Domain: {redirectExam.officialWebsite.replace('https://', '')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
