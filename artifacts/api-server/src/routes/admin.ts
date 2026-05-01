import { Router } from "express";
import { db } from "@workspace/db";
import { applicationsTable, jobsTable, hrEmailsTable, usersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireAdminOrHR } from "../middleware/requireAuth";
import { z } from "zod";
import { sendEmail } from "../lib/mailer";
import { normalizeJobRecord } from "../lib/normalize-job";

const router = Router();
// General admin/hr routes
router.use("/applications", requireAdminOrHR);
router.use("/send-email", requireAdminOrHR);
router.use("/jobs", requireAdminOrHR);
router.use("/stats", requireAdminOrHR);

// Strictly admin routes
router.use("/hr-emails", requireAdmin);
router.use("/users", requireAdmin);

// Get all applications (admin)
router.get("/applications", async (req, res) => {
  const apps = await db.select({
    id: applicationsTable.id,
    jobId: applicationsTable.jobId,
    applicantName: applicationsTable.applicantName,
    applicantEmail: applicationsTable.applicantEmail,
    coverLetter: applicationsTable.coverLetter,
    status: applicationsTable.status,
    appliedAt: applicationsTable.appliedAt,
    jobTitle: jobsTable.title,
    company: jobsTable.company,
    hrEmail: jobsTable.hrEmail,
  }).from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
    .orderBy(desc(applicationsTable.appliedAt));
  res.json(apps.map((a: any) => ({ ...a, appliedAt: a.appliedAt.toISOString() })));
});

// Update application status (admin)
router.patch("/applications/:id/status", async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = z.object({
    status: z.enum(["Pre-Registered", "Pending", "Reviewed", "Interview", "Offered", "Rejected"])
  }).parse(req.body);
  const [updated] = await db.update(applicationsTable)
    .set({ status })
    .where(eq(applicationsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Application not found" }); return; }

  const [appWithJob] = await db.select({
    applicantName: applicationsTable.applicantName,
    applicantEmail: applicationsTable.applicantEmail,
    jobTitle: jobsTable.title,
    company: jobsTable.company
  }).from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
    .where(eq(applicationsTable.id, id));

  if (!appWithJob) { res.status(404).json({ error: "Application details not found" }); return; }

  // Send automated email for specific status changes
  if (["Pending", "Reviewed", "Interview", "Offered", "Rejected"].includes(status)) {
    try {
      const subject = `Application Status Updated: ${status} - OpportuNet`;
      let body = "";
      
      switch(status) {
        case "Pending":
          body = `Hi ${appWithJob.applicantName},\n\nYour application for ${appWithJob.jobTitle || 'the position'} at ${appWithJob.company || 'our company'} is currently being processed and is under review. We will contact you once there is an update.`;
          break;
        case "Reviewed":
          body = `Hi ${appWithJob.applicantName},\n\nYour application for ${appWithJob.jobTitle || 'the position'} at ${appWithJob.company || 'our company'} has been reviewed. Our team is considering your profile for the next steps.`;
          break;
        case "Interview":
          body = `Hi ${appWithJob.applicantName},\n\nGreat news! You have been shortlisted for an interview for the position of ${appWithJob.jobTitle || 'the position'} at ${appWithJob.company || 'our company'}. Please wait for our HR team to reach out with the schedule.`;
          break;
        case "Offered":
          body = `Hi ${appWithJob.applicantName},\n\nCongratulations! We are pleased to extend an offer for the position of ${appWithJob.jobTitle || 'the position'} at ${appWithJob.company || 'our company'}. Please check your portal or wait for a formal offer letter via email.`;
          break;
        case "Rejected":
          body = `Hi ${appWithJob.applicantName},\n\nThank you for your interest in joining ${appWithJob.company || 'our company'}. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We wish you the best in your future endeavors.`;
          break;
      }

      await sendEmail({
        to: appWithJob.applicantEmail,
        subject,
        body,
        applicantName: appWithJob.applicantName,
      });
      console.log(`Automated ${status} email sent to ${appWithJob.applicantEmail}`);
    } catch (err) {
      console.error(`Failed to send automated email:`, err);
    }
  }

  res.json({ ...updated, appliedAt: updated.appliedAt.toISOString() });
});

// Send email to applicant (admin)
router.post("/send-email", async (req, res) => {
  const payload = z.object({
    to: z.string().email(),
    subject: z.string().min(1),
    body: z.string().min(1),
    applicantName: z.string().optional(),
  }).parse(req.body);

  try {
    const result = await sendEmail(payload);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all HR emails
router.get("/hr-emails", async (req, res) => {
  const emails = await db.select({
    id: hrEmailsTable.id,
    jobId: hrEmailsTable.jobId,
    email: hrEmailsTable.email,
    label: hrEmailsTable.label,
    addedBy: hrEmailsTable.addedBy,
    createdAt: hrEmailsTable.createdAt,
    jobTitle: jobsTable.title,
    company: jobsTable.company,
  }).from(hrEmailsTable)
    .leftJoin(jobsTable, eq(hrEmailsTable.jobId, jobsTable.id))
    .orderBy(desc(hrEmailsTable.createdAt));
  res.json(emails.map((e: any) => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

// Add HR email (admin)
router.post("/hr-emails", async (req, res) => {
  const { jobId, email, label } = z.object({
    jobId: z.number().optional(),
    email: z.string().email(),
    label: z.string().optional().default("Primary"),
  }).parse(req.body);
  const adminUser = req.session?.userId ? `admin-${req.session.userId}` : "admin";
  const [created] = await db.insert(hrEmailsTable).values({
    jobId: jobId ?? null,
    email, label,
    addedBy: adminUser,
  }).returning();
  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

// Delete HR email (admin)
router.delete("/hr-emails/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(hrEmailsTable).where(eq(hrEmailsTable.id, id));
  res.json({ success: true });
});

// Get all users (admin)
router.get("/users", async (req, res) => {
  const users = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    provider: usersTable.provider,
    createdAt: usersTable.createdAt,
  }).from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(users.map((u: any) => ({ ...u, createdAt: u.createdAt.toISOString() })));
});

// Get all jobs (admin)
router.get("/jobs", async (req, res) => {
  const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.id));
  res.json(jobs.map((j: any) => normalizeJobRecord(j)));
});

// Dashboard stats (admin)
router.get("/stats", async (req, res) => {
  const allApps = await db.select().from(applicationsTable);
  const allJobs = await db.select().from(jobsTable);
  const allUsers = await db.select().from(usersTable);
  const allHrEmails = await db.select().from(hrEmailsTable);

  const appsWithCategory = await db
    .select({
      status: applicationsTable.status,
      category: jobsTable.category,
    })
    .from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id));

  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  for (const row of appsWithCategory) {
    byStatus[row.status] = (byStatus[row.status] || 0) + 1;
    const category = row.category || "UNKNOWN";
    byCategory[category] = (byCategory[category] || 0) + 1;
  }

  res.json({
    totalApplications: allApps.length,
    totalJobs: allJobs.length,
    totalUsers: allUsers.length,
    totalHrEmails: allHrEmails.length,
    pendingApplications: allApps.filter((a: any) => a.status === "Pending").length,
    offeredApplications: allApps.filter((a: any) => a.status === "Offered").length,
    rejectedApplications: allApps.filter((a: any) => a.status === "Rejected").length,
    byStatus,
    byCategory,
  });
});

export default router;
