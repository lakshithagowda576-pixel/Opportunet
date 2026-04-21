import app from "./app";
export { logger } from "./lib/logger";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { jobsTable, examsTable, studyMaterialsTable, usersTable, applicationsTable } from "@workspace/db/schema";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { IT_JOBS, NONIT_JOBS, STATE_GOVT_JOBS, CENTRAL_GOVT_JOBS, buildJobRows } from "./lib/seed-data";
import { seedColleges } from "./lib/seed-colleges";

const port = Number(process.env["PORT"]) || 3001;

function validateIntegrationConfig() {
  const oauthCallbackBase = process.env.OAUTH_CALLBACK_BASE_URL;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    logger.warn("FRONTEND_URL is not set. Social login redirects may fail.");
  }
  if (!oauthCallbackBase) {
    logger.warn("OAUTH_CALLBACK_BASE_URL is not set. Falling back to request host for OAuth callbacks.");
  }

  const oauthProviders = [
    { name: "Google", id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET },
    { name: "GitHub", id: process.env.GITHUB_CLIENT_ID, secret: process.env.GITHUB_CLIENT_SECRET },
  ];
  for (const provider of oauthProviders) {
    if (!provider.id || !provider.secret) {
      logger.warn({ provider: provider.name }, "OAuth provider not fully configured");
    }
  }

  if (!process.env.API_KEY) {
    logger.warn("API_KEY is not set. Third-party API integrations may not work.");
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn("SMTP credentials are incomplete. Email sending will run in simulation mode.");
  }
}

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
  const [jobsCount] = await db.select({ count: count() }).from(jobsTable);
  const [examsCount] = await db.select({ count: count() }).from(examsTable);

  // Auto-seed if empty
  if (jobsCount.count === 0) {
    logger.info("Jobs table is empty — seeding live jobs...");
    const allJobs = [
      ...buildJobRows(IT_JOBS, "IT"),
      ...buildJobRows(NONIT_JOBS, "NON_IT"),
      ...buildJobRows(STATE_GOVT_JOBS, "STATE_GOVT"),
      ...buildJobRows(CENTRAL_GOVT_JOBS, "CENTRAL_GOVT"),
    ];

    const batchSize = 50;
    for (let i = 0; i < allJobs.length; i += batchSize) {
      const batch = allJobs.slice(i, i + batchSize);
      await db.insert(jobsTable).values(batch);
    }
    logger.info({ inserted: allJobs.length }, "Jobs seeded");
  }

  if (examsCount.count === 0) {
    logger.info("Exams table is empty — seeding exams and materials...");
    const exams = await db.insert(examsTable).values([
      // ... (rest of the exams insertion from the original file)
    {
      name: "PG-CET M.Tech",
      fullName: "Post Graduate Common Entrance Test – M.Tech 2026 (Karnataka)",
      description: "KEA PG-CET M.Tech 2026 for admission to M.Tech, M.E, M.Arch, M.Plan programs in Karnataka government and private engineering colleges. CBT tests candidates on discipline-specific engineering subjects.",
      examDate: "2026-06-15",
      applicationStartDate: "2026-04-01",
      applicationEndDate: "2026-05-10",
      applyLink: "https://kea.kar.nic.in/pgcet2026",
      eligibility: "Recognized B.E/B.Tech in relevant engineering branch with min 50% aggregate (45% SC/ST). Karnataka domicile or 7 years study in Karnataka. Final year students may apply provisionally.",
      applicationGuide: "Step 1: Visit the official KEA portal and navigate to the 'Admission' tab then select 'PGCET 2026'\nStep 2: Download and read the M.Tech Information Bulletin carefully\nStep 3: Click on the 'Online Application' link specifically for M.Tech/M.E/M.Arch\nStep 4: Register using your Aadhaar number and mobile for OTP verification\nStep 5: Fill in your academic details and select your PGCET subject code\nStep 6: Upload your photograph, signature, and left-hand thumb impression\nStep 7: Pay the application fee online (₹650 for General/OBC)\nStep 8: Take a printout of the final submitted application for counseling",
      officialWebsite: "https://kea.kar.nic.in",
    },
    {
      name: "PG-CET MBA",
      fullName: "Post Graduate Common Entrance Test – MBA 2026 (Karnataka)",
      description: "Karnataka PG-CET MBA 2026 by KEA for 2-year MBA programs across Karnataka business schools. Tests Verbal Ability, Quantitative Aptitude, Logical Reasoning, and General Awareness.",
      examDate: "2026-06-20",
      applicationStartDate: "2026-04-05",
      applicationEndDate: "2026-05-15",
      applyLink: "https://kea.kar.nic.in/pgcet2026",
      eligibility: "Any Bachelor's degree with min 50% marks (45% for SC/ST/OBC-I/Cat-1). Final year students eligible provisionally. No age bar for private colleges.",
      applicationGuide: "Step 1: On the KEA homepage, look for 'Flash News' or 'Latest Announcements' for PGCET 2026\nStep 2: Select the 'MBA Online Application' link to enter the dedicated portal\nStep 3: Create a login ID using your email and choose a strong password\nStep 4: Enter your personal details exactly as per your 10th marksheet\nStep 5: Select your preferred exam cities (you can choose up to 3)\nStep 6: Upload certificates for reservation (if applicable)\nStep 7: Complete the payment process via Net Banking or UPI\nStep 8: Preserve the 'S-Number' generated after successful submission",
      officialWebsite: "https://kea.kar.nic.in",
    },
    {
      name: "PG-CET MCA",
      fullName: "Post Graduate Common Entrance Test – MCA 2026 (Karnataka)",
      description: "KEA PG-CET MCA 2026 for 2-year MCA programs in Karnataka. Tests Mathematics, Computer Science fundamentals, and Analytical Ability. MCA graduates are highly sought in IT industry.",
      examDate: "2026-06-18",
      applicationStartDate: "2026-04-05",
      applicationEndDate: "2026-05-15",
      applyLink: "https://kea.kar.nic.in/pgcet2026",
      eligibility: "BCA/B.Sc Computer Science/any degree with Mathematics. Min 50% aggregate (45% SC/ST). Mathematics at 10+2 or degree level required.",
      applicationGuide: "Step 1: Access the KEA portal and find the 'PGCET MCA 2026' link in the sidebar\nStep 2: Register as a new user and verify your mobile number\nStep 3: Fill in the qualifying examination details (BCA/BSc)\nStep 4: Upload your recent passport size photo and signature\nStep 5: Pay the prescribed fee (₹650 for Gen/OBC, ₹500 for SC/ST)\nStep 6: Cross-verify all details before clicking 'Final Submit'\nStep 7: Download the PDF of the filled-in application form\nStep 8: Follow KEA announcements for Hall Ticket download dates",
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
    { examId: exams[0].id, title: "Engineering Aptitude Practice – Adda247", subject: "Aptitude", type: "Practice_Test", description: "Topic-wise engineering aptitude practice questions and timed quizzes aligned with PG-CET style problem-solving.", url: "https://www.adda247.com/engineering-jobs/" },
    { examId: exams[0].id, title: "GATE/PG-CET Formula Handbook – CSE", subject: "Computer Science", type: "Notes", description: "Quick revision formulas and short notes for algorithms, OS, DBMS, CN, and compiler design.", url: "https://www.geeksforgeeks.org/gate-cs-notes-gq/" },
    { examId: exams[1].id, title: "MBA PGCET Quantitative Aptitude – IndiaBIX", subject: "Quantitative Aptitude", type: "Practice_Test", description: "500+ QA problems on Arithmetic, Algebra, DI, and Time/Speed for MBA PGCET prep.", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
    { examId: exams[1].id, title: "Verbal Ability – MBA PGCET YouTube Course", subject: "Verbal Ability", type: "Video", description: "English grammar, RC strategies, verbal reasoning, and para-jumbles for MBA PGCET on YouTube.", url: "https://www.youtube.com/results?search_query=MBA+PGCET+verbal+ability+preparation" },
    { examId: exams[1].id, title: "Current Affairs 2025-26 – GK Today", subject: "General Awareness", type: "Notes", description: "Monthly current affairs, static GK, Economy, Science & Technology for MBA PGCET GK section.", url: "https://www.gktoday.in/current-affairs/" },
    { examId: exams[1].id, title: "MBA PGCET Mock Tests – Embibe", subject: "All Subjects", type: "Practice_Test", description: "Full MBA PGCET mock tests with previous year papers, time management, and section-wise analytics.", url: "https://www.embibe.com/exams/karnataka-pgcet-mba/" },
    { examId: exams[1].id, title: "Logical Reasoning – IndiaBIX Practice", subject: "Logical Reasoning", type: "Practice_Test", description: "Blood Relations, Syllogisms, Seating Arrangements, Puzzles for MBA PGCET Logical Reasoning section.", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/" },
    { examId: exams[1].id, title: "MBA PGCET Previous Papers – EntranceZone", subject: "All Subjects", type: "PDF", description: "Previous years MBA PGCET papers and exam pattern references useful for final revision.", url: "https://www.entrancezone.com/exam/karnataka-pgcet" },
    { examId: exams[1].id, title: "Data Interpretation Sets – Oliveboard", subject: "Quantitative Aptitude", type: "Practice_Test", description: "High-yield DI sets with detailed solutions to improve speed and accuracy for MBA PG-CET quant section.", url: "https://www.oliveboard.in/blog/data-interpretation-questions/" },
    { examId: exams[2].id, title: "MCA PG-CET Mathematics – NPTEL Discrete Maths", subject: "Mathematics", type: "Video", description: "Algebra, Calculus, Probability & Statistics, Set Theory, Mathematical Logic for MCA PG-CET.", url: "https://nptel.ac.in/courses/106106094" },
    { examId: exams[2].id, title: "C Programming & Data Structures – NPTEL", subject: "Computer Science", type: "Video", description: "C Programming, Data Structures, DBMS, OS, Computer Networks for MCA PG-CET by IIT faculty.", url: "https://nptel.ac.in/courses/106105085" },
    { examId: exams[2].id, title: "MCA PG-CET Mock Tests – Testbook", subject: "All Subjects", type: "Practice_Test", description: "Full MCA PGCET practice tests: Mathematics + CS + Analytical Ability. Tracks performance and weak areas.", url: "https://testbook.com/karnataka-pgcet-mca" },
    { examId: exams[2].id, title: "DBMS Concepts – GeeksforGeeks", subject: "Computer Science", type: "Notes", description: "ER diagrams, Normalization, SQL, Transactions, Indexing for MCA PG-CET Computer Science section.", url: "https://www.geeksforgeeks.org/dbms/" },
    { examId: exams[2].id, title: "Operating Systems Notes – GeeksforGeeks", subject: "Computer Science", type: "Notes", description: "Processes, threads, synchronization, memory management, scheduling, and deadlocks for MCA entrance preparation.", url: "https://www.geeksforgeeks.org/operating-systems/" },
    { examId: exams[2].id, title: "Computer Networks Notes – GeeksforGeeks", subject: "Computer Science", type: "Notes", description: "OSI model, TCP/IP, routing, transport layer, and application protocols for MCA PG-CET revision.", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
    { examId: exams[2].id, title: "MCA Entrance Mock Quiz – SelfStudys", subject: "All Subjects", type: "Practice_Test", description: "Section-wise MCA entrance mock quizzes covering mathematics, reasoning, and computer science fundamentals.", url: "https://www.selfstudys.com/mcatest" },
  ]);
    logger.info("Auto-seed completed: 3exams, 24 study materials");
  }
}

import { setupCronJobs } from "./tasks";

async function main() {
  validateIntegrationConfig();
  try {
    await autoSeed();
    await seedColleges();
    await ensureAdminUser();
    setupCronJobs();
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
