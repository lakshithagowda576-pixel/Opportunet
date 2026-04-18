-- Add new fields to applications table
ALTER TABLE applications ADD COLUMN user_id integer;
ALTER TABLE applications ADD COLUMN applicant_phone text;
ALTER TABLE applications ADD COLUMN applicant_address text;
ALTER TABLE applications ADD COLUMN education text;
ALTER TABLE applications ADD COLUMN qualification text;
ALTER TABLE applications ADD COLUMN resume_url text;
ALTER TABLE applications ADD COLUMN accepted_terms boolean DEFAULT false;

-- Add foreign key constraint for user_id
ALTER TABLE applications ADD CONSTRAINT applications_user_id_users_id_fk
  FOREIGN KEY (user_id) REFERENCES users(id);
