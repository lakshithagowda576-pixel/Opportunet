-- Create exam_results table to store user exam scores
CREATE TABLE exam_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  exam_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_marks INTEGER DEFAULT 600 NOT NULL,
  percentile DECIMAL(5,2),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

-- Create colleges table for Karnataka colleges
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'Karnataka' NOT NULL,
  college_code TEXT UNIQUE,
  affiliation TEXT,
  about TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  established_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create college_cutoffs table for PG-CET admission cutoffs
CREATE TABLE college_cutoffs (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL,
  course_name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  cutoff_score INTEGER NOT NULL,
  ug_seats INTEGER,
  pg_seats INTEGER,
  academic_year TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (college_id) REFERENCES colleges(id)
);

-- Create college_fees table for fees structure
CREATE TABLE college_fees (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL,
  course_type TEXT NOT NULL, -- 'UG' or 'PG'
  course_name TEXT NOT NULL,
  annual_fees DECIMAL(10,2),
  total_fees DECIMAL(10,2),
  description TEXT,
  academic_year TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (college_id) REFERENCES colleges(id)
);

-- Create index for faster queries
CREATE INDEX idx_exam_results_user_id ON exam_results(user_id);
CREATE INDEX idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX idx_colleges_city ON colleges(city);
CREATE INDEX idx_college_cutoffs_college_id ON college_cutoffs(college_id);
CREATE INDEX idx_college_cutoffs_score ON college_cutoffs(cutoff_score);
CREATE INDEX idx_college_fees_college_id ON college_fees(college_id);
