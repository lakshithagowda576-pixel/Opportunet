import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";
import { eq, like, or, and } from "drizzle-orm";
import { ListJobsQueryParams, GetJobParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/jobs", async (req, res) => {
  const query = ListJobsQueryParams.parse(req.query);

  const conditions = [];

  if (query.category) {
    conditions.push(eq(jobsTable.category, query.category as any));
  }

  if (query.search) {
    const term = `%${query.search}%`;
    conditions.push(
      or(
        like(jobsTable.title, term),
        like(jobsTable.company, term),
        like(jobsTable.location, term),
        like(jobsTable.description, term),
        like(jobsTable.eligibility, term),
        like(jobsTable.salary, term)
      )
    );
  }

  const jobs =
    conditions.length === 0
      ? await db.select().from(jobsTable)
      : conditions.length === 1
      ? await db.select().from(jobsTable).where(conditions[0])
      : await db.select().from(jobsTable).where(and(...conditions));

  const formatted = jobs.map((j) => ({
    ...j,
    createdAt: j.createdAt.toISOString(),
  }));
  res.json(formatted);
});

router.get("/jobs/:id", async (req, res) => {
  const params = GetJobParams.parse({ id: parseInt(req.params.id) });
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.id));
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json({ ...job, createdAt: job.createdAt.toISOString() });
});

export default router;
