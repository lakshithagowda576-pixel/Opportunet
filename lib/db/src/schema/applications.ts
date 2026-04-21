import { pgTable, serial, text, integer, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { jobsTable } from "./jobs";
import { usersTable } from "./users";

export const applicationStatusEnum = pgEnum("application_status", [
  "Pending",
  "Reviewed",
  "Interview",
  "Offered",
  "Rejected",
]);

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id),
  userId: integer("user_id").references(() => usersTable.id),
  applicantName: text("applicant_name").notNull(),
  applicantEmail: text("applicant_email").notNull(),
  applicantPhone: text("applicant_phone"),
  applicantAddress: text("applicant_address"),
  education: text("education"),
  qualification: text("qualification"),
  resumeUrl: text("resume_url"),
  acceptedTerms: boolean("accepted_terms").notNull().default(false),
  coverLetter: text("cover_letter"),
  status: applicationStatusEnum("status").notNull().default("Pending"),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  appliedAt: true,
  status: true,
});
export type InsertApplication = typeof applicationsTable.$inferInsert;
export type Application = typeof applicationsTable.$inferSelect;
