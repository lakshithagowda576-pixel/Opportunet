import { db } from "../lib/db/src/index.ts";
import { jobsTable, examsTable, collegesTable, collegeCutoffsTable } from "../lib/db/src/schema/index.ts";
import { count } from "drizzle-orm";

async function check() {
  const [jobs] = await db.select({ count: count() }).from(jobsTable);
  const [exams] = await db.select({ count: count() }).from(examsTable);
  const [colleges] = await db.select({ count: count() }).from(collegesTable);
  const [cutoffs] = await db.select({ count: count() }).from(collegeCutoffsTable);

  console.log({
    jobs: jobs.count,
    exams: exams.count,
    colleges: colleges.count,
    cutoffs: cutoffs.count
  });
  
  if (exams.count > 0) {
    const allExams = await db.select().from(examsTable);
    console.log("Exams:", allExams);
  }

  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
