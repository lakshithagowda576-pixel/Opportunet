import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase, Users, Mail, CheckCircle, XCircle, Clock, Shield,
  Send, Plus, Trash2, Eye, BarChart3, FileText, AlertCircle, Loader2,
  Building2, ChevronDown, RefreshCw, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string, opts?: RequestInit) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include", ...opts }).then(r => r.json());

type AdminTab = "dashboard" | "applications" | "hr-emails" | "users";

const STATUS_COLORS: Record<string, string> = {
  "Pre-Registered": "bg-slate-100 text-slate-800 border-slate-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Reviewed: "bg-blue-100 text-blue-800 border-blue-200",
  Interview: "bg-purple-100 text-purple-800 border-purple-200",
  Offered: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
  Redirected: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [jobFilter, setJobFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Redirect if not admin or hr
  if (!user || (user.role !== "admin" && user.role !== "hr")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="w-16 h-16 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold">Admin Access Required</h2>
        <p className="text-muted-foreground text-sm">You need admin or HR privileges to access this page.</p>
        <button onClick={() => navigate("/login")} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold">
          Sign In as Admin
        </button>
      </div>
    );
  }

  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: () => apiFetch("/stats") });
  const { data: applications = [], isLoading: isAppsLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => apiFetch("/applications"),
    enabled: activeTab === "applications" || activeTab === "dashboard",
  });
  const { data: hrEmails = [] } = useQuery({
    queryKey: ["admin-hr-emails"],
    queryFn: () => apiFetch("/hr-emails"),
    enabled: activeTab === "hr-emails",
  });
  const { data: allUsers = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiFetch("/users"),
    enabled: activeTab === "users",
  });
  const { data: allJobs = [] } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => apiFetch("/jobs"),
  });

  // Update application status
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiFetch(`/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: (data: any, variables) => { 
      qc.invalidateQueries({ queryKey: ["admin-applications"] }); 
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      if (variables.status === "Interview" || variables.status === "Pending" || variables.status === "Rejected") {
        toast({ title: "Status Updated", description: `Application status changed to ${variables.status}. An automated email has been sent to the applicant.` });
      } else {
        toast({ title: "Status Updated", description: `Application status changed to ${variables.status}.` });
      }
    },
  });

  // Email modal
  const [emailModal, setEmailModal] = useState<{ to: string; name: string; subject: string; body: string } | null>(null);
  const sendEmailMutation = useMutation({
    mutationFn: (data: { to: string; subject: string; body: string; applicantName: string }) =>
      apiFetch("/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    onSuccess: (data) => {
      toast({ title: data.simulated ? "Email Simulated" : "Email Sent!", description: data.message || "Email sent to applicant." });
      setEmailModal(null);
    },
    onError: () => toast({ title: "Failed", description: "Could not send email.", variant: "destructive" }),
  });

  // HR Email form
  const [hrForm, setHrForm] = useState({ email: "", label: "Primary", jobId: "" });
  const addHrEmailMutation = useMutation({
    mutationFn: (data: any) => apiFetch("/hr-emails", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-hr-emails"] }); setHrForm({ email: "", label: "Primary", jobId: "" }); toast({ title: "HR Email Added!" }); },
  });
  const deleteHrEmailMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/hr-emails/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-hr-emails"] }),
  });

  const tabs: { id: AdminTab; label: string; icon: typeof BarChart3 }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "applications", label: "Applications", icon: FileText },
    ...(user.role === "admin" ? [{ id: "hr-emails" as AdminTab, label: "HR Emails", icon: Mail }] : []),
    ...(user.role === "admin" ? [{ id: "users" as AdminTab, label: "Users", icon: Users }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 to-primary rounded-2xl p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
            <p className="text-white/70 text-sm">Welcome, {user.name} · {user.email}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-card p-1.5 rounded-2xl border border-border shadow-sm flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all", activeTab === tab.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Jobs", value: stats?.totalJobs ?? 0, icon: Briefcase, color: "text-blue-600 bg-blue-50" },
              { label: "Total Applications", value: stats?.totalApplications ?? 0, icon: FileText, color: "text-purple-600 bg-purple-50" },
              { label: "Pending Reviews", value: stats?.pendingApplications ?? 0, icon: Clock, color: "text-amber-600 bg-amber-50" },
              { label: "Offers Made", value: stats?.offeredApplications ?? 0, icon: CheckCircle, color: "text-green-600 bg-green-50" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.color)}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h4 className="font-semibold text-sm mb-3">Applications by Status</h4>
              <div className="space-y-2">
                {Object.entries((stats as any)?.byStatus || {}).map(([status, count]) => (
                  <button 
                    key={status} 
                    onClick={() => { setStatusFilter(status); setActiveTab("applications"); }}
                    className="w-full flex items-center justify-between text-sm p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <span className={cn("px-2 py-0.5 rounded-full border text-xs font-semibold", STATUS_COLORS[status] || "bg-secondary text-secondary-foreground border-border")}>
                      {status}
                    </span>
                    <span className="font-bold">{count as number}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h4 className="font-semibold text-sm mb-3">Applications by Module</h4>
              <div className="space-y-2">
                {Object.entries((stats as any)?.byCategory || {}).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="px-2 py-0.5 rounded-full border text-xs font-semibold bg-secondary text-secondary-foreground border-border">
                      {String(category).replace("_", " ")}
                    </span>
                    <span className="font-bold">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-base">Recent Applications</h3>
              <button onClick={() => setActiveTab("applications")} className="text-xs text-primary hover:underline font-medium">View All</button>
            </div>
            <div className="divide-y divide-border">
              {(applications as any[]).slice(0, 8).map((app: any) => (
                <div key={app.id} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{app.applicantName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{app.applicantName}</p>
                    <p className="text-xs text-muted-foreground truncate">{app.jobTitle} · {app.company}</p>
                  </div>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", STATUS_COLORS[app.status])}>{app.status}</span>
                  <button
                    onClick={() => setEmailModal({ to: app.applicantEmail, name: app.applicantName, subject: `Regarding your application for ${app.jobTitle}`, body: `Dear ${app.applicantName},\n\nThank you for applying for the position of ${app.jobTitle} at ${app.company}.\n\nYour current application status is: ${app.status}\n\nBest regards,\nHR Team, GovPortal` })}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Send Email">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> 
              All Applications ({(applications as any[]).filter((app: any) => (!jobFilter || app.jobId === jobFilter) && (!statusFilter || app.status === statusFilter)).length})
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={statusFilter || ""} 
                onChange={e => setStatusFilter(e.target.value || null)}
                className="px-3 py-1.5 rounded-lg border border-border text-sm bg-background text-foreground outline-none hover:border-primary transition-colors"
              >
                <option value="">All Statuses</option>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {user.role === "hr" && (
                <select 
                  value={jobFilter || ""} 
                  onChange={e => setJobFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm bg-background text-foreground outline-none hover:border-primary transition-colors"
                >
                  <option value="">All Jobs</option>
                  {(allJobs as any[]).map(job => (
                    <option key={job.id} value={job.id}>{job.title} - {job.company}</option>
                  ))}
                </select>
              )}
              {(jobFilter || statusFilter) && (
                <button 
                  onClick={() => { setJobFilter(null); setStatusFilter(null); }}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Clear Filters"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => qc.invalidateQueries({ queryKey: ["admin-applications"] })} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          {isAppsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Job</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Applied</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(applications as any[])
                    .filter((app: any) => (!jobFilter || app.jobId === jobFilter) && (!statusFilter || app.status === statusFilter))
                    .map((app: any) => (
                    <tr key={app.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-foreground">{app.applicantName}</p>
                        <p className="text-xs text-muted-foreground">{app.applicantEmail}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground truncate max-w-[160px]">{app.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">{app.company}</p>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(app.appliedAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={app.status}
                          onChange={e => statusMutation.mutate({ id: app.id, status: e.target.value })}
                          className={cn("text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer outline-none", STATUS_COLORS[app.status])}
                        >
                          {Object.keys(STATUS_COLORS).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1.5 flex-wrap">
                          <button
                            onClick={() => statusMutation.mutate({ id: app.id, status: "Reviewed" })}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Mark as Reviewed">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => statusMutation.mutate({ id: app.id, status: "Interview" })}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors" title="Schedule Interview">
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => statusMutation.mutate({ id: app.id, status: "Offered" })}
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors" title="Accept">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => statusMutation.mutate({ id: app.id, status: "Rejected" })}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEmailModal({
                              to: app.applicantEmail,
                              name: app.applicantName,
                              subject: `Update on your application for ${app.jobTitle}`,
                              body: `Dear ${app.applicantName},\n\nWe are pleased to inform you about your application for ${app.jobTitle} at ${app.company}.\n\nStatus: ${app.status}\n\nBest regards,\nHR Team`
                            })}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Send Email">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(applications as any[]).length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No applications yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* HR Emails Tab */}
      {activeTab === "hr-emails" && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Add HR Email</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">HR Email Address *</label>
                <input
                  type="email" value={hrForm.email} onChange={e => setHrForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="hr@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border-2 border-border focus:border-primary outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Label</label>
                <select value={hrForm.label} onChange={e => setHrForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border-2 border-border focus:border-primary outline-none text-sm">
                  <option>Primary</option><option>Secondary</option><option>Technical</option><option>HR Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Link to Job (optional)</label>
                <select value={hrForm.jobId} onChange={e => setHrForm(f => ({ ...f, jobId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border-2 border-border focus:border-primary outline-none text-sm">
                  <option value="">Global (all jobs)</option>
                  {(allJobs as any[]).slice(0, 50).map((j: any) => (
                    <option key={j.id} value={j.id}>{j.title} – {j.company}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => addHrEmailMutation.mutate({ email: hrForm.email, label: hrForm.label, jobId: hrForm.jobId ? parseInt(hrForm.jobId) : undefined })}
              disabled={!hrForm.email || addHrEmailMutation.isPending}
              className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              {addHrEmailMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add HR Email
            </button>
          </div>

          {/* HR Emails list */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-base flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> HR Email Directory ({(hrEmails as any[]).length})</h3>
            </div>
            <div className="divide-y divide-border">
              {(hrEmails as any[]).map((e: any) => (
                <div key={e.id} className="p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{e.email}</p>
                    <p className="text-xs text-muted-foreground">{e.label} · {e.jobTitle ? `${e.jobTitle} – ${e.company}` : "Global (all jobs)"}</p>
                  </div>
                  <button
                    onClick={() => setEmailModal({ to: e.email, name: "HR", subject: "Message from GovPortal Admin", body: "" })}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Send Email">
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHrEmailMutation.mutate(e.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(hrEmails as any[]).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No HR emails added yet. Add one above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-base flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Registered Users ({(allUsers as any[]).length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(allUsers as any[]).map((u: any) => (
                  <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", u.role === "admin" ? "bg-red-100 text-red-700 border-red-200" : "bg-blue-100 text-blue-700 border-blue-200")}>{u.role}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full capitalize">{u.provider}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Send Email</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">To</label>
                <input value={emailModal.to} readOnly className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Subject</label>
                <input
                  value={emailModal.subject}
                  onChange={e => setEmailModal(m => m ? { ...m, subject: e.target.value } : m)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border-2 border-border focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Message</label>
                <textarea
                  value={emailModal.body}
                  onChange={e => setEmailModal(m => m ? { ...m, body: e.target.value } : m)}
                  rows={8}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border-2 border-border focus:border-primary outline-none text-sm resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <strong>Note:</strong> Configure SMTP_HOST, SMTP_USER, SMTP_PASS environment secrets for real email delivery. Currently running in simulation mode.
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEmailModal(null)} className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors">Cancel</button>
              <button
                onClick={() => sendEmailMutation.mutate({ to: emailModal.to, subject: emailModal.subject, body: emailModal.body, applicantName: emailModal.name })}
                disabled={sendEmailMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {sendEmailMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
