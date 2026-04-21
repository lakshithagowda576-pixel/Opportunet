import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

async function removeDuplicates() {
  console.log("Fetching all jobs...");
  const allJobs = await db.select().from(jobsTable);
  
  const seen = new Set<string>();
  const toDelete: number[] = [];
  
  for (const job of allJobs) {
    const identifier = `${job.title}|${job.company}|${job.location}|${job.category}`;
    if (seen.has(identifier)) {
      toDelete.push(job.id);
    } else {
      seen.add(identifier);
    }
  }
  
  console.log(`Found ${toDelete.length} duplicates to remove.`);
  
  for (const id of toDelete) {
    await db.delete(jobsTable).where(eq(jobsTable.id, id));
  }
  
  console.log("Cleanup complete.");
}

removeDuplicates().catch(console.error);
