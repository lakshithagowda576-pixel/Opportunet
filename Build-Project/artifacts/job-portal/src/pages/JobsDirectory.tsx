import { useState } from "react";
import { useListJobs, ListJobsCategory } from "@workspace/api-client-react";
import { Search, Filter, Loader2 } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { cn } from "@/lib/utils";

export default function JobsDirectory() {
  const [activeTab, setActiveTab] = useState<ListJobsCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: jobs, isLoading } = useListJobs({
    category: activeTab === "ALL" ? undefined : activeTab,
    search: searchQuery || undefined
  });

  const categories = [
    { id: "ALL", label: "All Jobs" },
    { id: ListJobsCategory.IT, label: "IT Sector" },
    { id: ListJobsCategory.NON_IT, label: "Non-IT Sector" },
    { id: ListJobsCategory.STATE_GOVT, label: "State Govt (KPSC)" },
    { id: ListJobsCategory.CENTRAL_GOVT, label: "Central Govt (SSC/UPSC)" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Job Directory</h1>
        <p className="text-muted-foreground text-lg">Find and apply for the best opportunities across various sectors.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by job title, company, or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors">
          <Filter className="w-5 h-5" />
          More Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id as any)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200",
              activeTab === category.id
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "bg-card text-muted-foreground border border-border hover:bg-secondary hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-card rounded-2xl border border-dashed border-border text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any positions matching your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
