-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."application_status" AS ENUM('Pending', 'Reviewed', 'Interview', 'Offered', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('email', 'google', 'github', 'facebook', 'linkedin');--> statement-breakpoint
CREATE TYPE "public"."job_category" AS ENUM('IT', 'NON_IT', 'STATE_GOVT', 'CENTRAL_GOVT');--> statement-breakpoint
CREATE TYPE "public"."shift_type" AS ENUM('Day', 'Night', 'Full_time', 'Part_time');--> statement-breakpoint
CREATE TYPE "public"."study_material_type" AS ENUM('PDF', 'Video', 'Notes', 'Practice_Test');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'hr');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"applicant_name" text NOT NULL,
	"applicant_email" text NOT NULL,
	"cover_letter" text,
	"status" "application_status" DEFAULT 'Pending' NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"provider" "auth_provider" DEFAULT 'email' NOT NULL,
	"provider_id" text,
	"avatar" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "study_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"title" text NOT NULL,
	"subject" text NOT NULL,
	"type" "study_material_type" NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hr_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer,
	"email" text NOT NULL,
	"label" text DEFAULT 'Primary' NOT NULL,
	"added_by" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"sender_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"hr_email" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"is_reply" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" text NOT NULL,
	"expire" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"description" text NOT NULL,
	"exam_date" text NOT NULL,
	"application_start_date" text NOT NULL,
	"application_end_date" text NOT NULL,
	"apply_link" text NOT NULL,
	"eligibility" text NOT NULL,
	"application_guide" text NOT NULL,
	"official_website" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"category" "job_category" NOT NULL,
	"location" text NOT NULL,
	"shift" "shift_type" NOT NULL,
	"description" text NOT NULL,
	"eligibility" text NOT NULL,
	"application_guide" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"hr_email" text NOT NULL,
	"salary" text NOT NULL,
	"openings" integer DEFAULT 1 NOT NULL,
	"application_link" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"official_url" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hr_emails" ADD CONSTRAINT "hr_emails_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
*/