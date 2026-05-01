import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { like } from "drizzle-orm";

async function cleanup() {
  const result = await db.delete(applicationsTable)
    .where(like(applicationsTable.applicantEmail, "%@example.com"))
    .returning();
  
  console.log(`Deleted ${result.length} applications with @example.com emails.`);
}

cleanup().then(() => process.exit(0));
