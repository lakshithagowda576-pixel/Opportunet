"use client"

import { Navbar } from "@/components/Navbar"
import { Clock, FileText, AlertCircle, CheckCircle } from "lucide-react"

const mockApplications = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: "Tech Corp",
    status: "Pending",
    appliedAt: "2024-01-15",
    location: "Bangalore"
  },
  {
    id: 2,
    jobTitle: "Backend Developer",
    company: "StartUp Inc",
    status: "In Review",
    appliedAt: "2024-01-14",
    location: "Mumbai"
  },
  {
    id: 3,
    jobTitle: "Full Stack Developer",
    company: "WebFlow",
    status: "Interview Scheduled",
    appliedAt: "2024-01-10",
    location: "Delhi"
  },
]

export default function Dashboard() {
  const stats = [
    { label: "Total Applications", value: 3 },
    { label: "Pending", value: 1 },
    { label: "In Review", value: 1 },
    { label: "Interviews", value: 1 },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "In Review":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "Interview Scheduled":
        return <AlertCircle className="h-5 w-5 text-purple-600" />
      case "Offer":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10"
      case "In Review":
        return "bg-blue-500/10"
      case "Interview Scheduled":
        return "bg-purple-500/10"
      case "Offer":
        return "bg-green-500/10"
      default:
        return "bg-gray-500/10"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div>
          <h1 className="text-4xl font-black">My Applications</h1>
          <p className="text-muted-foreground mt-2">Track all your job applications in one place</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border bg-card p-6">
              <p className="text-sm text-muted-foreground font-bold uppercase">{stat.label}</p>
              <p className="text-3xl font-black mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6">Applications</h2>
          <div className="space-y-4">
            {mockApplications.map((app) => (
              <div
                key={app.id}
                className={`rounded-3xl border p-6 ${getStatusColor(app.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{app.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {app.company} • {app.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(app.status)}
                    <span className="font-bold text-sm">{app.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
