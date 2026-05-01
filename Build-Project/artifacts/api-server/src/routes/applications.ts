import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { applicationsTable, jobsTable, usersTable, examsTable } from "@workspace/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  CreateApplicationBody,
  UpdateApplicationStatusBody,
  UpdateApplicationStatusParams,
  GetJobApplicantCountParams,
} from "@workspace/api-zod";
import { sendPreRegistrationEmail, sendApplicationConfirmationEmail } from "../lib/email-service";
import bcrypt from "bcrypt";

const router: IRouter = Router();

// Middleware to ensure authentication for specific routes
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  next();
};

async function getSessionUser(req: any) {
  if (!req.session?.userId) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId));
  return user;
}

function normalizeJobRecord(job: any) {
  if (!job) return undefined;
  return {
    ...job,
    createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : job.createdAt,
    updatedAt: job.updatedAt instanceof Date ? job.updatedAt.toISOString() : job.updatedAt,
  };
}

router.get("/applications", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }

  const jobId = req.query.jobId ? parseInt(req.query.jobId as string) : null;
  const isPrivileged = user.role === "admin" || user.role === "hr";

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

  // Security: Only admins can see all. Candidates see only theirs.
  if (!isPrivileged) {
    let userFilter = sql`${applicationsTable.userId} = ${user.id} OR ${applicationsTable.applicantEmail} = ${user.email}`;
    if (jobId) {
      baseQuery = baseQuery.where(and(eq(applicationsTable.jobId, jobId), userFilter));
    } else {
      baseQuery = baseQuery.where(userFilter);
    }
  } else if (jobId) {
    baseQuery = baseQuery.where(eq(applicationsTable.jobId, jobId));
  }

  const apps = await baseQuery.orderBy(desc(applicationsTable.appliedAt));

  const formatted = apps.map((a: any) => ({
    ...a,
    appliedAt: a.appliedAt.toISOString(),
    job: a.job ? normalizeJobRecord(a.job) : undefined,
  }));
  res.json(formatted);
});

router.post("/applications", requireAuth, async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

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
      acceptedTerms: true, // Auto-accept on direct submit
      coverLetter,
      status: "Pending" as any,
    })
    .returning();

  sendApplicationConfirmationEmail(app.id);
  res.status(201).json({ ...app, appliedAt: app.appliedAt.toISOString() });
});

router.post("/pre-register", async (req, res) => {
  try {
    const { name, email, password, jobId } = req.body;

    if (!email || !jobId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    let [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    
    if (!user && password) {
      const passwordHash = await bcrypt.hash(password, 10);
      [user] = await db.insert(usersTable).values({
        name: name || email.split('@')[0],
        email,
        passwordHash,
        provider: "email",
        role: "user",
      }).returning();
    }

    const [existing] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.jobId, jobId), eq(applicationsTable.applicantEmail, email)));

    if (existing) {
      res.status(400).json({ error: "You have already registered for this job." });
      return;
    }

    const [app] = await db
      .insert(applicationsTable)
      .values({
        jobId,
        userId: user?.id,
        applicantName: name || user?.name || email.split('@')[0],
        applicantEmail: email,
        status: "Pre-Registered" as any,
        acceptedTerms: true,
      })
      .returning();

    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
    if (job) await sendPreRegistrationEmail(email, name || user?.name || email.split('@')[0], job);

    res.status(201).json({ success: true, applicationId: app.id });
  } catch (error: any) {
    console.error("Pre-registration error:", error);
    res.status(500).json({ error: error.message || "Pre-registration failed" });
  }
});

router.patch("/applications/:id/status", requireAuth, async (req, res) => {
  const [updated] = await db
    .update(applicationsTable)
    .set({ status: req.body.status as any })
    .where(eq(applicationsTable.id, parseInt(req.params.id)))
    .returning();

  if (!updated) return res.status(404).json({ error: "Application not found" });
  res.json({ ...updated, appliedAt: updated.appliedAt.toISOString() });
});

router.get("/jobs/:id/applicant-count", async (req, res) => {
  const apps = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.jobId, parseInt(req.params.id)));

  const byStatus: Record<string, number> = {
    Pending: 0, Reviewed: 0, Interview: 0, Offered: 0, Rejected: 0, "Pre-Registered": 0
  };

  for (const app of apps) {
    if (byStatus[app.status] !== undefined) byStatus[app.status]++;
  }

  res.json({ jobId: parseInt(req.params.id), total: apps.length, byStatus });
});

export default router;
