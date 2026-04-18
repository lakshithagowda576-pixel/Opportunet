import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { jobsTable, jobCategoryEnum } from "./schema/jobs";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const { Pool } = pg;

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL must be set.");
    process.exit(1);
  }

  console.log("Connecting to the database...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("Seeding jobs...");
  const categories = ["IT", "NON_IT", "STATE_GOVT", "CENTRAL_GOVT"] as const;
  
  const jobsToInsert = [];
  
  for (const category of categories) {
    for (let i = 1; i <= 80; i++) {
      jobsToInsert.push({
        title: `${category.replace("_", " ")} Role ${i}`,
        company: `Company ${category} ${i}`,
        category,
        location: ["New York", "San Francisco", "London", "Remote", "Austin"][i % 5],
        shift: (["Day", "Night", "Full_time", "Part_time"] as const)[i % 4],
        description: `This is a great opportunity for a ${category} specialist. We are looking for self-motivated individuals to join our team.`,
        eligibility: ["Bachelors", "Masters", "High School", "PhD"][i % 4],
        applicationGuide: "Please apply via the portal and submit your resume.",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        hrEmail: `hr${i}@${category.toLowerCase().replace("_", "")}.com`,
        salary: `$${50 + (i % 10) * 10}k - $${100 + (i % 10) * 10}k`,
        openings: (i % 5) + 1,
        applicationLink: `https://example.com/apply/${category.toLowerCase()}/${i}`,
      });
    }
  }

  // Insert in batches of 100 to avoid query size limits
  const batchSize = 100;
  for (let i = 0; i < jobsToInsert.length; i += batchSize) {
    const batch = jobsToInsert.slice(i, i + batchSize);
    await db.insert(jobsTable).values(batch);
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(jobsToInsert.length / batchSize)}`);
  }

  console.log(`Successfully seeded ${jobsToInsert.length} jobs.`);
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
