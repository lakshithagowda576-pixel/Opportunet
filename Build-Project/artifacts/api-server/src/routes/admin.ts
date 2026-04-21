import { Router } from "express";
import { db } from "@workspace/db";
import { applicationsTable, jobsTable, hrEmailsTable, usersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/requireAuth";
import nodemailer from "nodemailer";
import { z } from "zod";

const router = Router();
router.use(requireAdmin);

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
  res.json(apps.map(a => ({ ...a, appliedAt: a.appliedAt.toISOString() })));
});

// Update application status (admin)
router.patch("/applications/:id/status", async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = z.object({
    status: z.enum(["Pending", "Reviewed", "Interview", "Offered", "Rejected"])
  }).parse(req.body);
  const [updated] = await db.update(applicationsTable)
    .set({ status })
    .where(eq(applicationsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Application not found" }); return; }
  res.json({ ...updated, appliedAt: updated.appliedAt.toISOString() });
});

// Send email to applicant (admin)
router.post("/send-email", async (req, res) => {
  const { to, subject, body, applicantName } = z.object({
    to: z.string().email(),
    subject: z.string().min(1),
    body: z.string().min(1),
    applicantName: z.string().optional(),
  }).parse(req.body);

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || smtpUser || "noreply@govportal.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    // Simulate email sending if SMTP not configured
    res.json({ 
      success: true, 
      simulated: true, 
      message: `Email would be sent to ${to}. Configure SMTP_HOST, SMTP_USER, SMTP_PASS environment variables for real email sending.` 
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `"GovPortal HR" <${fromEmail}>`,
      to,
      subject,
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">GovPortal</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          ${applicantName ? `<p>Dear <strong>${applicantName}</strong>,</p>` : ""}
          <div style="white-space: pre-wrap; line-height: 1.6;">${body}</div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 12px;">This email was sent from GovPortal HR Management System.</p>
        </div>
      </div>`,
    });
    res.json({ success: true, message: `Email sent to ${to}` });
  } catch (err: any) {
    res.status(500).json({ error: `Failed to send email: ${err.message}` });
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
  res.json(emails.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })));
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
  res.json(users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() })));
});

// Get all jobs (admin)
router.get("/jobs", async (req, res) => {
  const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.id));
  res.json(jobs.map(j => ({ ...j, createdAt: j.createdAt.toISOString() })));
});

// Dashboard stats (admin)
router.get("/stats", async (req, res) => {
  const [apps] = await db.select().from(applicationsTable);
  const allApps = await db.select().from(applicationsTable);
  const allJobs = await db.select().from(jobsTable);
  const allUsers = await db.select().from(usersTable);
  const allHrEmails = await db.select().from(hrEmailsTable);
  res.json({
    totalApplications: allApps.length,
    totalJobs: allJobs.length,
    totalUsers: allUsers.length,
    totalHrEmails: allHrEmails.length,
    pendingApplications: allApps.filter(a => a.status === "Pending").length,
    offeredApplications: allApps.filter(a => a.status === "Offered").length,
    rejectedApplications: allApps.filter(a => a.status === "Rejected").length,
  });
});

export default router;
