import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { like, or } from "drizzle-orm";

async function cleanup() {
  console.log("Cleaning up dummy applications...");
  const result = await db.delete(applicationsTable)
    .where(or(
      like(applicationsTable.applicantName, "User %"),
      like(applicationsTable.applicantName, "Applicant %")
    ))
    .returning();
  
  console.log(`Deleted ${result.length} dummy applications.`);
}

cleanup()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
