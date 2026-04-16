import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react"
import { JobListing } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface JobCardProps {
  job: JobListing
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="group relative flex flex-col rounded-2xl border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary text-xl font-bold">
          {job.company[0]}
        </div>
        <div className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {job.department}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{job.title}</h3>
        <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {job.type} • {job.shift}
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Ends {new Date(job.endDate).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div className="text-sm font-bold text-primary">
          View Details
        </div>
        <Link href={`/jobs/${job.id}`}>
          <Button size="sm" className="rounded-full group-hover:translate-x-1 transition-transform">
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
