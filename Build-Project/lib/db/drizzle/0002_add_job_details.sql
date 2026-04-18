-- Add new fields to jobs table for detailed job information
ALTER TABLE jobs ADD COLUMN brief_introduction text DEFAULT '' NOT NULL;
ALTER TABLE jobs ADD COLUMN role_description text DEFAULT '' NOT NULL;
ALTER TABLE jobs ADD COLUMN required_skills text DEFAULT '' NOT NULL;
ALTER TABLE jobs ADD COLUMN qualifications_and_experience text DEFAULT '' NOT NULL;
ALTER TABLE jobs ADD COLUMN steps_to_apply text DEFAULT '' NOT NULL;
