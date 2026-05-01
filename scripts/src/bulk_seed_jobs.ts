import { db } from "@workspace/db";
import { jobsTable, applicationsTable, usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

async function bulkSeed() {
  console.log("Starting full bulk seeding (Jobs, Users, Applications)...");

  // 1. Create Dummy Users
  console.log("Creating 50 dummy users...");
  const usersToInsert = [];
  for (let i = 1; i <= 50; i++) {
    usersToInsert.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      passwordHash: "password123", // Simple password for testing
      phone: `98765432${i.toString().padStart(2, '0')}`,
      address: `Street ${i}, City ${i}, India`,
      education: "Bachelor's Degree",
      qualification: "Software Engineering",
    });
  }
  
  // Using insert...onConflictDoNothing if possible, or just check count
  const existingUsers = await db.select().from(usersTable);
  let users = existingUsers;
  if (existingUsers.length < 50) {
    await db.insert(usersTable).values(usersToInsert).onConflictDoNothing();
    users = await db.select().from(usersTable);
  }
  console.log(`Available users: ${users.length}`);

  // 2. Generate 1200 Jobs
  console.log("Generating 1200 jobs across all months...");
  const companies = [
    "Wipro", "TCS", "Infosys", "Accenture", "HCL", "IBM", "Tech Mahindra", "Mphasis", 
    "Mahindra Group", "ITC Limited", "Reliance Industries", "HDFC Bank", "Hindustan Unilever", 
    "Bajaj Allianz", "Byju's", "Delhivery", "Google", "Microsoft", "Amazon", "Apple", 
    "Meta", "Flipkart", "Zomato", "Swiggy", "Ola", "Uber", "Zoho", "Atlassian", "Oracle", 
    "ConsenSys", "Nestlé", "ABB", "Taj Hotels", "Sabyasachi", "Adfactors PR", "Karnataka PWD", 
    "KEA", "KPSC", "SSC", "UPSC", "RRB", "IBPS", "ISRO", "DRDO", "Cognizant", "Capgemini",
    "L&T Infotech", "Mindtree", "Paytm", "PhonePe", "BharatPe", "Groww", "Zerodha"
  ];

  const jobTitles: Record<string, string[]> = {
    IT: [
      "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", 
      "Data Scientist", "DevOps Engineer", "UI/UX Designer", "Cloud Solutions Architect", 
      "Cybersecurity Analyst", "Mobile App Developer", "QA Automation Engineer", 
      "Machine Learning Engineer", "Blockchain Developer", "Database Administrator", 
      "System Administrator", "Site Reliability Engineer", "Security Engineer", 
      "Data Engineer", "AI Researcher", "Embedded Systems Engineer"
    ],
    NON_IT: [
      "HR Executive", "Marketing Manager", "Operations Coordinator", "Finance Analyst", 
      "Supply Chain Manager", "Sales Executive", "Content Writer", "Logistics Executive", 
      "Brand Manager", "Public Relations Manager", "Legal Counsel", "Administrative Assistant", 
      "Customer Support Specialist", "Business Development Manager", "Finance Manager",
      "Accountant", "Project Manager", "Office Administrator", "Receptionist"
    ],
    STATE_GOVT: [
      "Junior Engineer (Civil)", "Assistant Professor", "Police Sub Inspector", 
      "Commercial Tax Inspector", "Agriculture Officer", "Staff Nurse", 
      "Village Administrative Officer", "Revenue Inspector", "Assistant Engineer", 
      "School Teacher", "FDA", "SDA", "Police Constable", "Panchayat Development Officer"
    ],
    CENTRAL_GOVT: [
      "SSC CGL Officer", "UPSC Civil Servant", "RRB Technician", "IBPS Probationary Officer", 
      "ISRO Scientist", "DRDO Researcher", "SSC CHSL Assistant", "NDA Cadet", 
      "Postal Assistant", "Income Tax Inspector", "Assistant Section Officer",
      "Auditor", "Accountant", "Statistical Investigator", "Railway Guard"
    ]
  };

  const locations = [
    "Bangalore, Karnataka", "Hyderabad, Telangana", "Pune, Maharashtra", 
    "Chennai, Tamil Nadu", "Noida, Uttar Pradesh", "Mumbai, Maharashtra", 
    "Kolkata, West Bengal", "Delhi NCR", "Mysore, Karnataka", "Hubli, Karnataka", 
    "Ahmedabad, Gujarat", "Remote", "Mangalore, Karnataka", "Belgaum, Karnataka",
    "Gulbarga, Karnataka", "Bellary, Karnataka", "Dharwad, Karnataka"
  ];

  const categories = ["IT", "NON_IT", "STATE_GOVT", "CENTRAL_GOVT"] as const;
  const shifts = ["Day", "Full_time", "Night", "Part_time"] as const;

  const allJobsToInsert: any[] = [];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  for (const month of months) {
    for (let i = 0; i < 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const title = jobTitles[category][Math.floor(Math.random() * jobTitles[category].length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const shift = shifts[Math.floor(Math.random() * shifts.length)];
      
      const startDay = Math.floor(Math.random() * 20) + 1;
      const endDay = startDay + Math.floor(Math.random() * 10) + 5;
      
      const startDate = `2026-${month.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
      const endDate = `2026-${month.toString().padStart(2, '0')}-${Math.min(endDay, 30).toString().padStart(2, '0')}`;
      
      allJobsToInsert.push({
        title: `${title} (${month}-${i + 1})`,
        company,
        category,
        location,
        shift,
        description: `Join ${company} as a ${title}. We are looking for talented individuals to join our team in ${location}. This is a great opportunity to grow your career in a dynamic environment.`,
        eligibility: "Bachelor's degree in relevant field. 0-5 years of experience. Strong communication skills.",
        applicationGuide: "1. Visit careers portal\n2. Search for the job code\n3. Apply with your updated resume\n4. Complete the online assessment",
        startDate,
        endDate,
        hrEmail: `careers@${company.toLowerCase().replace(/ /g, '')}.com`,
        salary: `₹${Math.floor(Math.random() * 20) + 5}–${Math.floor(Math.random() * 30) + 15} LPA`,
        openings: Math.floor(Math.random() * 50) + 1,
        official_url: `https://careers.${company.toLowerCase().replace(/ /g, '')}.com`,
      });
    }
  }

  const chunkSize = 100;
  const insertedJobs = [];
  for (let i = 0; i < allJobsToInsert.length; i += chunkSize) {
    const chunk = allJobsToInsert.slice(i, i + chunkSize);
    const result = await db.insert(jobsTable).values(chunk).returning();
    insertedJobs.push(...result);
    console.log(`Inserted ${insertedJobs.length} jobs...`);
  }

  // 3. Create 1000+ Applications
  console.log("Creating 1200+ applications (one for each job)...");
  const appsToInsert = [];
  const statuses = ["Pre-Registered", "Pending", "Reviewed", "Interview", "Offered", "Rejected", "Redirected"];
  
  for (let i = 0; i < insertedJobs.length; i++) {
    const job = insertedJobs[i];
    const user = users[Math.floor(Math.random() * users.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)] as "Pre-Registered" | "Pending" | "Reviewed" | "Interview" | "Offered" | "Rejected" | "Redirected";
    
    // Spread application dates across the months
    const appliedMonth = parseInt(job.startDate.split('-')[1]);
    const appliedDay = Math.floor(Math.random() * 10) + 1;
    const appliedAt = new Date(`2026-${appliedMonth.toString().padStart(2, '0')}-${appliedDay.toString().padStart(2, '0')}`);

    appsToInsert.push({
      jobId: job.id,
      userId: user.id,
      applicantName: user.name,
      applicantEmail: user.email,
      applicantPhone: user.phone,
      status,
      acceptedTerms: true,
      appliedAt: appliedAt,
    });
  }

  for (let i = 0; i < appsToInsert.length; i += chunkSize) {
    const chunk = appsToInsert.slice(i, i + chunkSize);
    await db.insert(applicationsTable).values(chunk);
    console.log(`Inserted ${i + chunk.length} applications...`);
  }

  console.log("Full bulk seeding completed successfully!");
}

bulkSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
