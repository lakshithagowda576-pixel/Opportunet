import app from "./app";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { jobsTable, examsTable, studyMaterialsTable, usersTable } from "@workspace/db/schema";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { IT_JOBS, NONIT_JOBS, STATE_GOVT_JOBS, CENTRAL_GOVT_JOBS, buildJobRows } from "./lib/seed-data";

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

async function ensureAdminUser() {
  const adminEmail = "admin@govportal.com";
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail));
  if (!existing) {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    await db.insert(usersTable).values({
      name: "GovPortal Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
      provider: "email",
    });
    logger.info("Default admin user created: admin@govportal.com / Admin@123");
  }
}

async function autoSeed() {
  const [result] = await db.select({ count: count() }).from(jobsTable);
  if (result && result.count > 0) {
    logger.info({ jobCount: result.count }, "Database already has jobs, skipping seed");
    return;
  }

  logger.info("Database is empty — running auto-seed with 320+ jobs...");

  await db.delete(studyMaterialsTable);
  await db.delete(examsTable);
  await db.delete(jobsTable);

  const allJobs = [
    ...buildJobRows(IT_JOBS, "IT"),
    ...buildJobRows(NONIT_JOBS, "NON_IT"),
    ...buildJobRows(STATE_GOVT_JOBS, "STATE_GOVT"),
    ...buildJobRows(CENTRAL_GOVT_JOBS, "CENTRAL_GOVT"),
  ];

  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < allJobs.length; i += batchSize) {
    const batch = allJobs.slice(i, i + batchSize);
    await db.insert(jobsTable).values(batch);
    inserted += batch.length;
  }
  logger.info({ inserted }, "Jobs seeded");

  const exams = await db.insert(examsTable).values([
    {
      name: "PG-CET M.Tech",
      fullName: "Post Graduate Common Entrance Test – M.Tech 2026 (Karnataka)",
      description: "KEA PG-CET M.Tech 2026 for admission to M.Tech, M.E, M.Arch, M.Plan programs in Karnataka government and private engineering colleges. CBT tests candidates on discipline-specific engineering subjects.",
      examDate: "2026-06-15",
      applicationStartDate: "2026-04-01",
      applicationEndDate: "2026-05-10",
      applyLink: "https://kea.kar.nic.in",
      eligibility: "Recognized B.E/B.Tech in relevant engineering branch with min 50% aggregate (45% SC/ST). Karnataka domicile or 7 years study in Karnataka. Final year students may apply provisionally.",
      applicationGuide: "Step 1: Visit kea.kar.nic.in and download M.Tech PG-CET 2026 notification\nStep 2: Register on KEA portal with valid email and mobile number\nStep 3: Fill application form with personal, educational, and specialization details\nStep 4: Upload photo (max 50KB), signature (max 30KB) in JPEG format\nStep 5: Select preferred exam center in Karnataka\nStep 6: Pay fee: ₹650 (General/OBC), ₹500 (SC/ST/Category-1)\nStep 7: Submit and download PDF acknowledgment\nStep 8: Download Hall Ticket 10 days before exam\nStep 9: Appear for CBT — 100 questions, 90 minutes\nStep 10: Check results and register for online counseling",
      officialWebsite: "https://kea.kar.nic.in",
    },
    {
      name: "PG-CET MBA",
      fullName: "Post Graduate Common Entrance Test – MBA 2026 (Karnataka)",
      description: "Karnataka PG-CET MBA 2026 by KEA for 2-year MBA programs across Karnataka business schools. Tests Verbal Ability, Quantitative Aptitude, Logical Reasoning, and General Awareness.",
      examDate: "2026-06-20",
      applicationStartDate: "2026-04-05",
      applicationEndDate: "2026-05-15",
      applyLink: "https://kea.kar.nic.in",
      eligibility: "Any Bachelor's degree with min 50% marks (45% for SC/ST/OBC-I/Cat-1). Final year students eligible provisionally. No age bar for private colleges.",
      applicationGuide: "Step 1: Visit kea.kar.nic.in and check MBA PG-CET 2026 notification\nStep 2: Create KEA account with your email ID\nStep 3: Select 'PGCET MBA 2026' and complete all application sections\nStep 4: Upload 10th, 12th, and degree certificates\nStep 5: Pay fee: ₹650 (General), ₹500 (SC/ST)\nStep 6: Note your Application Reference Number\nStep 7: Download Hall Ticket 1 week before exam\nStep 8: Appear for MBA PGCET — 100 questions, 90 minutes (no negative marking)\nStep 9: Register for KEA centralized counseling after results",
      officialWebsite: "https://kea.kar.nic.in",
    },
    {
      name: "PG-CET MCA",
      fullName: "Post Graduate Common Entrance Test – MCA 2026 (Karnataka)",
      description: "KEA PG-CET MCA 2026 for 2-year MCA programs in Karnataka. Tests Mathematics, Computer Science fundamentals, and Analytical Ability. MCA graduates are highly sought in IT industry.",
      examDate: "2026-06-18",
      applicationStartDate: "2026-04-05",
      applicationEndDate: "2026-05-15",
      applyLink: "https://kea.kar.nic.in",
      eligibility: "BCA/B.Sc Computer Science/any degree with Mathematics. Min 50% aggregate (45% SC/ST). Mathematics at 10+2 or degree level required.",
      applicationGuide: "Step 1: Visit kea.kar.nic.in and download MCA PG-CET 2026 brochure\nStep 2: Register on KEA portal with email and phone\nStep 3: Select 'PGCET MCA 2026' and fill application form\nStep 4: Upload photo, signature, degree certificates, Mathematics certificate\nStep 5: Pay ₹650 (General) or ₹500 (SC/ST) via net banking/UPI\nStep 6: Download acknowledgment\nStep 7: Appear for CBT exam after downloading Hall Ticket\nStep 8: Participate in online counseling after results",
      officialWebsite: "https://kea.kar.nic.in",
    },
  ]).returning();

  await db.insert(studyMaterialsTable).values([
    { examId: exams[0].id, title: "M.Tech Engineering Mathematics – NPTEL Notes", subject: "Engineering Mathematics", type: "Notes", description: "Comprehensive notes on Calculus, Linear Algebra, Differential Equations, Numerical Methods, and Transforms for PG-CET M.Tech prep.", url: "https://nptel.ac.in/courses/111104086" },
    { examId: exams[0].id, title: "Data Structures & Algorithms – NPTEL Video Course", subject: "Computer Science", type: "Video", description: "Complete video course covering Arrays, Linked Lists, Trees, Graphs, Dynamic Programming for M.Tech CSE PG-CET.", url: "https://nptel.ac.in/courses/106102064" },
    { examId: exams[0].id, title: "M.Tech PG-CET Previous Papers – GFG GATE Papers", subject: "All Engineering Subjects", type: "PDF", description: "Previous year M.Tech PG-CET Karnataka papers with answer keys. Covers CS, ECE, Civil, Mechanical branches.", url: "https://www.geeksforgeeks.org/gate-previous-year-solved-papers/" },
    { examId: exams[0].id, title: "M.Tech PG-CET Full Mock Test Series – GATE Overflow", subject: "All Subjects", type: "Practice_Test", description: "Full-length mock tests with percentile ranking and performance analytics for M.Tech PG-CET.", url: "https://gateoverflow.in/" },
    { examId: exams[0].id, title: "Signals & Systems – NPTEL ECE (IIT Faculty)", subject: "Electronics Engineering", type: "Video", description: "Fourier Analysis, Z-Transform, Laplace Transform, Sampling, and Filter Design for ECE PG-CET by IIT faculty.", url: "https://nptel.ac.in/courses/108103174" },
    { examId: exams[0].id, title: "Structural Analysis – NPTEL Civil Engineering", subject: "Civil Engineering", type: "Video", description: "Trusses, beams, frames, RCC Design, Soil Mechanics, and Fluid Mechanics for Civil Engineering PG-CET.", url: "https://nptel.ac.in/courses/105104122" },
    { examId: exams[0].id, title: "Thermodynamics – NPTEL Mechanical Engineering", subject: "Mechanical Engineering", type: "Video", description: "Thermodynamics, Heat Transfer, Fluid Mechanics, Theory of Machines for Mechanical PG-CET by IIT professors.", url: "https://nptel.ac.in/courses/112104113" },
    { examId: exams[1].id, title: "MBA PGCET Quantitative Aptitude – IndiaBIX", subject: "Quantitative Aptitude", type: "Practice_Test", description: "500+ QA problems on Arithmetic, Algebra, DI, and Time/Speed for MBA PGCET prep.", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
    { examId: exams[1].id, title: "Verbal Ability – MBA PGCET YouTube Course", subject: "Verbal Ability", type: "Video", description: "English grammar, RC strategies, verbal reasoning, and para-jumbles for MBA PGCET on YouTube.", url: "https://www.youtube.com/results?search_query=MBA+PGCET+verbal+ability+preparation" },
    { examId: exams[1].id, title: "Current Affairs 2025-26 – GK Today", subject: "General Awareness", type: "Notes", description: "Monthly current affairs, static GK, Economy, Science & Technology for MBA PGCET GK section.", url: "https://www.gktoday.in/current-affairs/" },
    { examId: exams[1].id, title: "MBA PGCET Mock Tests – Embibe", subject: "All Subjects", type: "Practice_Test", description: "Full MBA PGCET mock tests with previous year papers, time management, and section-wise analytics.", url: "https://www.embibe.com/exams/karnataka-pgcet-mba/" },
    { examId: exams[1].id, title: "Logical Reasoning – IndiaBIX Practice", subject: "Logical Reasoning", type: "Practice_Test", description: "Blood Relations, Syllogisms, Seating Arrangements, Puzzles for MBA PGCET Logical Reasoning section.", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/" },
    { examId: exams[2].id, title: "MCA PG-CET Mathematics – NPTEL Discrete Maths", subject: "Mathematics", type: "Video", description: "Algebra, Calculus, Probability & Statistics, Set Theory, Mathematical Logic for MCA PG-CET.", url: "https://nptel.ac.in/courses/106106094" },
    { examId: exams[2].id, title: "C Programming & Data Structures – NPTEL", subject: "Computer Science", type: "Video", description: "C Programming, Data Structures, DBMS, OS, Computer Networks for MCA PG-CET by IIT faculty.", url: "https://nptel.ac.in/courses/106105085" },
    { examId: exams[2].id, title: "MCA PG-CET Mock Tests – Testbook", subject: "All Subjects", type: "Practice_Test", description: "Full MCA PGCET practice tests: Mathematics + CS + Analytical Ability. Tracks performance and weak areas.", url: "https://testbook.com/karnataka-pgcet-mca" },
    { examId: exams[2].id, title: "DBMS Concepts – GeeksforGeeks", subject: "Computer Science", type: "Notes", description: "ER diagrams, Normalization, SQL, Transactions, Indexing for MCA PG-CET Computer Science section.", url: "https://www.geeksforgeeks.org/dbms/" },
  ]);

  logger.info("Auto-seed completed: 320+ jobs, 3 exams, 16 study materials");
}

async function main() {
  try {
    await autoSeed();
    await ensureAdminUser();
  } catch (err) {
    logger.error({ err }, "Startup tasks failed, continuing anyway");
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

main();
