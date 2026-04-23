import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { applicationsTable, jobsTable, usersTable, examsTable } from "@workspace/db/schema";
import { and, eq, sql, desc } from "drizzle-orm";
import {
  CreateApplicationBody,
  UpdateApplicationStatusBody,
  UpdateApplicationStatusParams,
  GetJobApplicantCountParams,
} from "@workspace/api-zod";
import { buildDefaultHrEmail, normalizeJobRecord } from "../lib/normalize-job";
import { requireAuth } from "../middleware/requireAuth";
import { sendApplicationConfirmationEmail } from "../lib/email-service";

const router: IRouter = Router();
router.use("/applications", requireAuth);

async function getSessionUser(req: any) {
  if (!req.session?.userId) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId));
  return user;
}

router.get("/applications", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }
  const isPrivileged = user.role === "admin" || user.role === "hr";
  const jobId = req.query.jobId ? parseInt(req.query.jobId as string) : null;

  // Build the base query
  let baseQuery = db
    .select({
      id: applicationsTable.id,
      jobId: applicationsTable.jobId,
      examId: applicationsTable.examId,
      course: applicationsTable.course,
      applicantName: applicationsTable.applicantName,
      applicantEmail: applicationsTable.applicantEmail,
      status: applicationsTable.status,
      appliedAt: applicationsTable.appliedAt,
      job: jobsTable,
      examName: examsTable.name,
    })
    .from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
    .leftJoin(examsTable, eq(applicationsTable.examId, examsTable.id)) as any;

  // Apply filtering based on conditions
  if (jobId) {
    baseQuery = baseQuery.where(eq(applicationsTable.jobId, jobId));
  } else if (!isPrivileged) {
    baseQuery = baseQuery.where(eq(applicationsTable.applicantEmail, user.email));
  }

  // Apply ordering and execute query
  const apps = await baseQuery.orderBy(desc(applicationsTable.appliedAt));

  const formatted = apps.map((a: any) => ({
    ...a,
    appliedAt: a.appliedAt.toISOString(),
    job: a.job ? normalizeJobRecord(a.job) : undefined,
  }));
  res.json(formatted);
});

router.post("/applications", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }

  const { jobId, examId, course, applicantName, applicantEmail, applicantPhone, applicantAddress, education, qualification, resumeUrl, acceptedTerms, coverLetter } = req.body;

  // Check if already applied
  const [existing] = await db
    .select()
    .from(applicationsTable)
    .where(
      and(
        jobId ? eq(applicationsTable.jobId, jobId) : eq(applicationsTable.examId, examId!),
        eq(applicationsTable.applicantEmail, user.email || applicantEmail)
      )
    );

  if (existing) {
    res.status(400).json({ error: "You have already applied for this." });
    return;
  }

  const [app] = await db
    .insert(applicationsTable)
    .values({
      jobId,
      examId,
      course,
      userId: user.id,
      applicantName: user.name || applicantName,
      applicantEmail: user.email || applicantEmail,
      applicantPhone,
      applicantAddress,
      education,
      qualification,
      resumeUrl,
      acceptedTerms,
      coverLetter,
    })
    .returning();

  const formattedApp = { ...app, appliedAt: app.appliedAt.toISOString() };
  res.status(201).json(formattedApp);

  // Send the specific email based on type
  sendApplicationConfirmationEmail(app.id);
});

router.patch("/applications/:id/status", async (req, res) => {
  const params = UpdateApplicationStatusParams.parse({ id: parseInt(req.params.id) });
  const body = UpdateApplicationStatusBody.parse(req.body);

  const [updated] = await db
    .update(applicationsTable)
    .set({ status: body.status as any })
    .where(eq(applicationsTable.id, params.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json({ ...updated, appliedAt: updated.appliedAt.toISOString() });
});

router.get("/jobs/:id/applicant-count", async (req, res) => {
  const params = GetJobApplicantCountParams.parse({ id: parseInt(req.params.id) });

  const apps = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.jobId, params.id));

  const byStatus: Record<string, number> = {
    Pending: 0,
    Reviewed: 0,
    Interview: 0,
    Offered: 0,
    Rejected: 0,
  };

  for (const app of apps) {
    byStatus[app.status]++;
  }

  res.json({
    jobId: params.id,
    total: apps.length,
    byStatus,
  });
});

router.post("/applications/track", async (req, res) => {
  const { jobId, applicantName, applicantEmail } = req.body;

  if (!jobId || !applicantName || !applicantEmail) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  // Create a tracking record as an application with Redirected status
  const [app] = await db
    .insert(applicationsTable)
    .values({
      jobId,
      applicantName,
      applicantEmail,
      status: "Redirected" as any,
    })
    .returning();

  const normalizedJob = normalizeJobRecord(job);

  // If user is tracked, their applications will show up in "My Applications" due to email matching.
  sendApplicationConfirmationEmail(app.id);

  res.json({
    trackingId: app.id,
    officialUrl: normalizedJob.official_url,
    official_url: normalizedJob.official_url,
    applicationLink: normalizedJob.applicationLink,
    hrEmail: normalizedJob.hrEmail || buildDefaultHrEmail(job.company),
    success: true
  });
});

router.get("/applications/summary", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }

  const isPrivileged = user.role === "admin" || user.role === "hr";
  const rows = await db
    .select({
      status: applicationsTable.status,
      category: jobsTable.category,
    })
    .from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
    .where(isPrivileged ? undefined : eq(applicationsTable.applicantEmail, user.email));

  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const row of rows) {
    const status = row.status || "Pending";
    const category = row.category || "UNKNOWN";
    byStatus[status] = (byStatus[status] || 0) + 1;
    byCategory[category] = (byCategory[category] || 0) + 1;
  }

  res.json({
    total: rows.length,
    byStatus,
    byCategory,
  });
});

export default router;
