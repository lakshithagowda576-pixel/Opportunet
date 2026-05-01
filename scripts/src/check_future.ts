import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { gt } from "drizzle-orm";

async function check() {
  const now = new Date();
  const apps = await db.select().from(applicationsTable).where(gt(applicationsTable.appliedAt, now));
  console.log(`Future applications: ${apps.length}`);
  apps.slice(0, 10).forEach(a => console.log(`- ${a.applicantName} (${a.appliedAt.toISOString()})`));
}

check().then(() => process.exit(0));
