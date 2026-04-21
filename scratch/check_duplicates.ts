import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";
import { count, eq } from "drizzle-orm";

async function checkJobs() {
  const allJobs = await db.select().from(jobsTable);
  console.log(`Total jobs in DB: ${allJobs.length}`);
  
  const itJobs = allJobs.filter(j => j.category === "IT");
  console.log(`IT jobs in DB: ${itJobs.length}`);
  
  const counts: Record<string, number> = {};
  itJobs.forEach(j => {
    const key = `${j.title}-${j.company}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  
  console.log("IT Job counts (duplicates):");
  Object.entries(counts).forEach(([key, count]) => {
    if (count > 1) {
      console.log(`  ${key}: ${count}`);
    }
  });
}

checkJobs().catch(console.error);
