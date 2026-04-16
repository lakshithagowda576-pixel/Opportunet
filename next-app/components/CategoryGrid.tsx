import { Cpu, Users, GraduationCap, Landmark, Train } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    title: "IT Department",
    description: "IBM, Wipro, TCS, Accenture & more",
    icon: Cpu,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    href: "/jobs?dept=IT"
  },
  {
    title: "Non-IT Department",
    description: "Sales, Marketing, HR & Operations",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    href: "/jobs?dept=Non-IT"
  },
  {
    title: "Government",
    description: "State level jobs & KPSC openings",
    icon: Landmark,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    href: "/jobs?dept=Government"
  },
  {
    title: "Central Govt",
    description: "Railway, SSC CGL, UPSC & SSC",
    icon: Train,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    href: "/jobs?dept=Central-Government"
  },
  {
    title: "PG-CET",
    description: "Exams, materials & application steps",
    icon: GraduationCap,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    href: "/exams/pg-cet"
  }
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {categories.map((cat) => (
        <Link 
          key={cat.title} 
          href={cat.href}
          className="group relative flex flex-col items-center justify-center rounded-2xl border bg-card p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
        >
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} transition-transform group-hover:scale-110`}>
            <cat.icon className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold">{cat.title}</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-tight">
            {cat.description}
          </p>
        </Link>
      ))}
    </div>
  )
}
