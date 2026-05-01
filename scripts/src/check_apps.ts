import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";

async function check() {
  const apps = await db.select().from(applicationsTable);
  console.log(`Remaining applications: ${apps.length}`);
  apps.slice(0, 10).forEach(a => console.log(`- ${a.applicantName} (${a.status})`));
}

check().then(() => process.exit(0));
