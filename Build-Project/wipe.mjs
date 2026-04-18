import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";
import { logger } from "./artifacts/api-server/src/lib/logger";

async function wipe() {
  try {
    await db.delete(jobsTable);
    console.log("Jobs wiped successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
wipe();
