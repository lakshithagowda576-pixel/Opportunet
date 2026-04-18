import { relations } from "drizzle-orm/relations";
import { jobs, applications, exams, studyMaterials, hrEmails, messages } from "./schema";

export const applicationsRelations = relations(applications, ({one}) => ({
	job: one(jobs, {
		fields: [applications.jobId],
		references: [jobs.id]
	}),
}));

export const jobsRelations = relations(jobs, ({many}) => ({
	applications: many(applications),
	hrEmails: many(hrEmails),
	messages: many(messages),
}));

export const studyMaterialsRelations = relations(studyMaterials, ({one}) => ({
	exam: one(exams, {
		fields: [studyMaterials.examId],
		references: [exams.id]
	}),
}));

export const examsRelations = relations(exams, ({many}) => ({
	studyMaterials: many(studyMaterials),
}));

export const hrEmailsRelations = relations(hrEmails, ({one}) => ({
	job: one(jobs, {
		fields: [hrEmails.jobId],
		references: [jobs.id]
	}),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	job: one(jobs, {
		fields: [messages.jobId],
		references: [jobs.id]
	}),
}));