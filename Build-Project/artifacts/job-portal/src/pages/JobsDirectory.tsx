import { useState } from "react";
import { useListJobs, ListJobsCategory } from "@workspace/api-client-react";
import { Search, Filter, Loader2, Calendar } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { cn } from "@/lib/utils";

export default function JobsDirectory() {
  const [activeTab, setActiveTab] = useState<ListJobsCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMonth, setActiveMonth] = useState<string>("ALL");

  const { data: jobs, isLoading } = useListJobs({
    category: activeTab === "ALL" ? undefined : activeTab,
    search: searchQuery || undefined
  });

  const filteredJobs = jobs?.filter(job => {
    if (activeMonth === "ALL") return true;
    const startMonth = new Date(job.startDate).getMonth();
    return startMonth === parseInt(activeMonth);
  });

  const categories = [
    { id: "ALL", label: "All Sectors" },
    { id: ListJobsCategory.IT, label: "IT Sector" },
    { id: ListJobsCategory.NON_IT, label: "Non-IT" },
    { id: ListJobsCategory.STATE_GOVT, label: "State Govt" },
    { id: ListJobsCategory.CENTRAL_GOVT, label: "Central Govt" },
  ];

  const months = [
    { id: "ALL", label: "Any Month" },
    { id: "0", label: "January" },
    { id: "1", label: "February" },
    { id: "2", label: "March" },
    { id: "3", label: "April" },
    { id: "4", label: "May" },
    { id: "5", label: "June" },
    { id: "6", label: "July" },
    { id: "7", label: "August" },
    { id: "8", label: "September" },
    { id: "9", label: "October" },
    { id: "10", label: "November" },
    { id: "11", label: "December" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Job Directory</h1>
        <p className="text-muted-foreground text-lg">Find and apply for the best opportunities across various sectors.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card p-6 rounded-3xl shadow-xl border border-border space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by job title, company, or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground font-medium"
          />
        </div>
        
        <div className="flex flex-col gap-4">
           {/* Sector Tabs */}
           <div className="space-y-3">
             <label className="text-sm font-bold text-muted-foreground flex items-center gap-2 px-1">
                <Filter className="w-4 h-4" /> Filter by Sector
             </label>
             <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
               {categories.map((category) => (
                 <button
                   key={category.id}
                   onClick={() => setActiveTab(category.id as any)}
                   className={cn(
                     "px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 border",
                     activeTab === category.id
                       ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                       : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                   )}
                 >
                   {category.label}
                 </button>
               ))}
             </div>
           </div>

           {/* Month Filter */}
           <div className="space-y-3">
             <label className="text-sm font-bold text-muted-foreground flex items-center gap-2 px-1">
                <Calendar className="w-4 h-4" /> Filter by Opening Month
             </label>
             <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
               {months.map((month) => (
                 <button
                   key={month.id}
                   onClick={() => setActiveMonth(month.id)}
                   className={cn(
                     "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border",
                     activeMonth === month.id
                       ? "bg-accent text-accent-foreground border-accent shadow-md"
                       : "bg-background text-muted-foreground border-border hover:bg-secondary"
                   )}
                 >
                   {month.label}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs?.length ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-card rounded-2xl border border-dashed border-border text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any positions matching your current filters for {activeMonth !== "ALL" ? months.find(m => m.id === activeMonth)?.label : ""} across {activeTab !== "ALL" ? categories.find(c => c.id === activeTab)?.label : "all sectors"}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
