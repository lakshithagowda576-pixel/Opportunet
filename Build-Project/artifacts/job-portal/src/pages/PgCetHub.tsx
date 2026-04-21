import { useListExams, useListStudyMaterials } from "@workspace/api-client-react";
import { 
  GraduationCap, ExternalLink, CalendarDays, FileText, Video, 
  BookOpen, FlaskConical, CheckCircle2, ArrowRight, Loader2, ListChecks, Info
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export default function PgCetHub() {
  const { data: exams, isLoading: isExamsLoading } = useListExams();
  const { data: materials, isLoading: isMaterialsLoading } = useListStudyMaterials();
  const [selectedExam, setSelectedExam] = useState<number | "all">("all");

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'Video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'Notes': return <BookOpen className="w-5 h-5 text-amber-500" />;
      case 'Practice_Test': return <FlaskConical className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getMaterialBadgeColor = (type: string) => {
    switch (type) {
      case 'PDF': return "bg-red-50 text-red-700 border-red-200";
      case 'Video': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'Notes': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'Practice_Test': return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredMaterials = selectedExam === "all"
    ? materials
    : materials?.filter(m => m.examId === selectedExam);

  if (isExamsLoading || isMaterialsLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary mb-6">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">PG-CET Resource Hub</h1>
        <p className="text-lg text-muted-foreground">
          Complete guide to PG-CET exams — eligibility, application process, important dates, and study materials.
        </p>
      </div>

      {/* Exam Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold border-b border-border pb-2 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" /> Upcoming PG-CET Exams
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {exams?.map((exam) => {
            const steps = exam.applicationGuide?.split("\n").filter(s => s.trim()) ?? [];
            return (
              <div key={exam.id} className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
                {/* Exam Header */}
                <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">{exam.name}</h3>
                      <p className="text-white/80 text-sm mt-1">{exam.fullName}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                      <a 
                        href={exam.applyLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl text-sm font-bold shadow hover:bg-white/90 transition-colors"
                      >
                        Apply Online <ExternalLink className="w-4 h-4" />
                      </a>
                      <a 
                        href={exam.officialWebsite} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white border border-white/30 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors"
                      >
                        Official Site <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Description + Dates */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* About */}
                    <div>
                      <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" /> About This Exam
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{exam.description}</p>
                    </div>

                    {/* Important Dates */}
                    <div>
                      <h4 className="font-bold text-base mb-3 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary" /> Important Dates
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                          <p className="text-xs text-emerald-600 font-medium mb-1">Application Opens</p>
                          <p className="font-bold text-emerald-700 text-sm">{formatDate(exam.applicationStartDate)}</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                          <p className="text-xs text-red-600 font-medium mb-1">Last Date to Apply</p>
                          <p className="font-bold text-red-700 text-sm">{formatDate(exam.applicationEndDate)}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                          <p className="text-xs text-blue-600 font-medium mb-1">Exam Date</p>
                          <p className="font-bold text-blue-700 text-sm">{formatDate(exam.examDate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* How to Apply */}
                    <div>
                      <h4 className="font-bold text-base mb-3 flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-primary" /> How to Apply — Step by Step
                      </h4>
                      <div className="space-y-2">
                        {steps.map((step, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                              {step.replace(/^Step \d+:\s*/i, "")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Eligibility */}
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                      <h4 className="font-bold text-base mb-3 flex items-center gap-2 text-amber-800">
                        <CheckCircle2 className="w-4 h-4" /> Eligibility Criteria
                      </h4>
                      <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{exam.eligibility}</p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                      <h4 className="font-bold text-sm mb-3 text-primary">Quick Apply</h4>
                      <p className="text-xs text-muted-foreground mb-4">Click the official link to submit your application on the KEA portal.</p>
                      <a 
                        href={exam.applyLink} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Apply for {exam.name} <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Study Materials Repository */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-display font-bold border-b border-border pb-2 flex-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Study Materials & Syllabus Repository
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedExam("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedExam === "all" ? "bg-primary text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            All Materials
          </button>
          {exams?.map(exam => (
            <button
              key={exam.id}
              onClick={() => setSelectedExam(exam.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedExam === exam.id ? "bg-primary text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials?.map((mat) => (
            <a 
              key={mat.id}
              href={mat.url} target="_blank" rel="noreferrer"
              className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {getMaterialIcon(mat.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight mb-1">{mat.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{mat.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">{mat.subject}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getMaterialBadgeColor(mat.type)}`}>
                    {mat.type.replace("_", " ")}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>

        {filteredMaterials?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No materials found for this filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
