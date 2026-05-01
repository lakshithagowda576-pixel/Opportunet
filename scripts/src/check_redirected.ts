import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

async function check() {
  const apps = await db.select().from(applicationsTable).where(eq(applicationsTable.status, "Redirected" as any));
  console.log(`Redirected applications: ${apps.length}`);
}

check().then(() => process.exit(0));
