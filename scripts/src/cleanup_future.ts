import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { gt } from "drizzle-orm";

async function cleanup() {
  const now = new Date();
  const result = await db.delete(applicationsTable)
    .where(gt(applicationsTable.appliedAt, now))
    .returning();
  
  console.log(`Deleted ${result.length} applications with future dates.`);
}

cleanup().then(() => process.exit(0));
