import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Loader2, Search, Building2, MapPin, BookOpen, DollarSign,
  Users, Calendar, Globe, Mail, Phone, TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function PgCetResultFinder() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [score, setScore] = useState<number | "">("");
  const [totalMarks] = useState(600);
  const [examId] = useState(1); // PG-CET M.Tech
  const [submitted, setSubmitted] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const courses = [
    "MTech Computer Science",
    "MTech Electronics",
    "MTech Mechanical",
    "MTech Civil",
    "MTech Electrical",
    "MTech Machine Learning",
    "ME Computational Science",
    "MBA Finance",
    "MBA Marketing",
    "MBA HR Management",
    "MCA Data Science",
    "MCA Cloud Computing",
    "MCA Cyber Security"
  ];



  // Submit result
  const submitResultMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE}/api/colleges/results/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ examId, score, totalMarks }),
      });
      if (!response.ok) throw new Error("Failed to submit result");
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Result Submitted!", description: "Your result has been recorded. Matching colleges below." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Get matching colleges
  const { data: matchingColleges = [], isLoading: isLoadingColleges } = useQuery({
    queryKey: ["matching-colleges", score, selectedCourse],
    queryFn: async () => {
      if (!score || score <= 0) return [];
      const url = new URL(`${window.location.origin}${BASE}/api/colleges/matching-score/${score}`);
      if (selectedCourse) url.searchParams.append("course", selectedCourse);
      
      const response = await fetch(url.toString(), {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch colleges");
      return response.json();
    },
    enabled: submitted && !!score,
  });


  // Get college details
  const { data: collegeDetails } = useQuery({
    queryKey: ["college-details", selectedCollege],
    queryFn: async () => {
      if (!selectedCollege) return null;
      const response = await fetch(`${BASE}/api/colleges/${selectedCollege}/details`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch college details");
      return response.json();
    },
    enabled: !!selectedCollege,
  });

  const percentile = score && totalMarks ? ((score / totalMarks) * 100).toFixed(2) : "0";

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BookOpen className="w-16 h-16 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold">Login Required</h2>
        <p className="text-muted-foreground text-sm">Please sign in to view colleges matching your PG-CET score</p>
        <Link href="/login" className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/exams" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Exams
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">PG-CET College Finder</h1>
        </div>
        <p className="text-blue-100">Find colleges matching your PG-CET M.Tech score and explore fees & admission details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Entry - Left Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm sticky top-4">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Enter Your Score
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2 text-muted-foreground">Select Preferred Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none bg-background text-sm mb-4"
                  disabled={submitted}
                >
                  <option value="">All Engineering Branches</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>

                <label className="block text-xs font-semibold mb-2 text-muted-foreground">Your PG-CET Score (Max 600)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={totalMarks}
                    value={score}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value) : "";
                      if (typeof val === "number" && val > 600) {
                        toast({ title: "Invalid Score", description: "Score cannot exceed 600", variant: "destructive" });
                        return;
                      }
                      setScore(val);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-lg font-bold bg-background"
                    placeholder="e.g., 450"
                    disabled={submitted}
                  />
                  <div className="text-xs text-muted-foreground self-center whitespace-nowrap">/ {totalMarks}</div>
                </div>
              </div>


              {score && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                  <div className="text-xs text-blue-600 font-semibold">Percentile Score</div>
                  <div className="text-2xl font-bold text-blue-700">{percentile}%</div>
                </div>
              )}

              <button
                onClick={() => submitResultMutation.mutate()}
                disabled={!score || score <= 0 || submitted || submitResultMutation.isPending}
                className={cn(
                  "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                  submitted
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg"
                )}
              >
                {submitResultMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : submitted ? (
                  <>✓ Score Submitted</>
                ) : (
                  <>Submit Score</>
                )}
              </button>

              {submitted && score && (
                <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
                  Found <strong>{matchingColleges.length} colleges</strong> matching your score below →
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colleges List - Middle Column */}
        <div className="lg:col-span-1 space-y-4">
          {submitted && score ? (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> 
                Matching Colleges ({matchingColleges.length})
              </h2>

              {isLoadingColleges ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : matchingColleges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No colleges match your score yet.</p>
                  <p className="text-xs mt-2">Try a different score or check official KEA website.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {matchingColleges.map((college: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCollege(college.collegeId)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border-2 transition-all",
                        selectedCollege === college.collegeId
                          ? "bg-primary/10 border-primary"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <p className="font-semibold text-sm line-clamp-2">{college.collegeName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{college.collegeName}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-primary font-semibold">
                        <TrendingUp className="w-3 h-3" /> Cutoff: {college.cutoffScore}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-secondary/30 rounded-2xl p-6 border border-dashed border-border text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">Submit your score above to see matching colleges</p>
            </div>
          )}
        </div>

        {/* College Details - Right Column */}
        <div className="lg:col-span-1 space-y-4">
          {selectedCollege && collegeDetails ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                <h3 className="font-bold text-lg">{collegeDetails.name}</h3>
                <p className="text-xs text-green-100 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {collegeDetails.location}
                </p>
              </div>

              <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
                {/* About */}
                {collegeDetails.about && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground mb-2">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{collegeDetails.about}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  {collegeDetails.websiteUrl && (
                    <a href={collegeDetails.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <Globe className="w-4 h-4" /> Visit Website
                    </a>
                  )}
                  {collegeDetails.contactEmail && (
                    <a href={`mailto:${collegeDetails.contactEmail}`} className="flex items-center gap-2 text-primary hover:underline text-xs">
                      <Mail className="w-4 h-4" /> {collegeDetails.contactEmail}
                    </a>
                  )}
                  {collegeDetails.contactPhone && (
                    <a href={`tel:${collegeDetails.contactPhone}`} className="flex items-center gap-2 text-primary hover:underline text-xs">
                      <Phone className="w-4 h-4" /> {collegeDetails.contactPhone}
                    </a>
                  )}
                </div>

                {/* PG Fees */}
                {collegeDetails.fees && collegeDetails.fees.filter((f: any) => f.courseType === "PG").length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> PG Course Fees
                    </h4>
                    <div className="space-y-2">
                      {collegeDetails.fees
                        .filter((f: any) => f.courseType === "PG")
                        .map((fee: any, i: number) => (
                          <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-green-900">{fee.courseName}</p>
                            <p className="text-xs text-green-700 mt-1">
                              Annual: <strong>₹{parseInt(fee.annualFees || "0").toLocaleString()}</strong>
                            </p>
                            <p className="text-xs text-green-700">
                              Total: <strong>₹{parseInt(fee.totalFees || "0").toLocaleString()}</strong>
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Seats & Cutoffs */}
                {collegeDetails.cutoffs && collegeDetails.cutoffs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                      <Users className="w-4 h-4" /> Seats & Cutoffs
                    </h4>
                    <div className="space-y-2">
                      {collegeDetails.cutoffs.map((cutoff: any, i: number) => (
                        <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
                          <p className="font-semibold text-blue-900">{cutoff.courseName}</p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <span className="text-blue-700">Cutoff: <strong>{cutoff.cutoffScore}</strong></span>
                            {cutoff.pgSeats && <span className="text-blue-700">PG Seats: <strong>{cutoff.pgSeats}</strong></span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-secondary/30 rounded-2xl p-6 border border-dashed border-border text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">Select a college to see full details including fees and cutoffs</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> PG-CET M.Tech 2026 Important Dates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-muted-foreground mb-1">Application Opens</p>
            <p className="font-bold text-blue-600">April 1, 2026</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-muted-foreground mb-1">Application Closes</p>
            <p className="font-bold text-blue-600">May 10, 2026</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-muted-foreground mb-1">Exam Date</p>
            <p className="font-bold text-blue-600">June 15, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
