import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { applicationsTable, jobsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import {
  CreateApplicationBody,
  UpdateApplicationStatusBody,
  UpdateApplicationStatusParams,
  GetJobApplicantCountParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/applications", async (req, res) => {
  const apps = await db
    .select({
      id: applicationsTable.id,
      jobId: applicationsTable.jobId,
      applicantName: applicationsTable.applicantName,
      applicantEmail: applicationsTable.applicantEmail,
      status: applicationsTable.status,
      appliedAt: applicationsTable.appliedAt,
      job: jobsTable,
    })
    .from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id));

  const formatted = apps.map((a) => ({
    ...a,
    appliedAt: a.appliedAt.toISOString(),
    job: a.job ? { ...a.job, createdAt: a.job.createdAt.toISOString() } : undefined,
  }));
  res.json(formatted);
});

router.post("/applications", async (req, res) => {
  const body = CreateApplicationBody.parse(req.body);

  const [existing] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.jobId, body.jobId));

  if (existing && existing.applicantEmail === body.applicantEmail) {
    res.status(400).json({ error: "You have already applied for this job." });
    return;
  }

  const [app] = await db
    .insert(applicationsTable)
    .values({
      jobId: body.jobId,
      applicantName: body.applicantName,
      applicantEmail: body.applicantEmail,
      coverLetter: body.coverLetter,
    })
    .returning();

  res.status(201).json({ ...app, appliedAt: app.appliedAt.toISOString() });
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

  const byStatus = {
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

export default router;
