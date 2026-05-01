import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { or, eq } from "drizzle-orm";

async function cleanup() {
  const result = await db.delete(applicationsTable)
    .where(or(
      eq(applicationsTable.applicantName, "GovPortal Admin"),
      eq(applicationsTable.applicantName, "Test User"),
      eq(applicationsTable.status, "Redirected" as any)
    ))
    .returning();
  
  console.log(`Deleted ${result.length} test/redirected applications.`);
}

cleanup().then(() => process.exit(0));
