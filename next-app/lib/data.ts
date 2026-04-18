export interface JobListing {
  id: string;
  title: string;
  company: string;
  department: 'IT' | 'Non-IT' | 'Government' | 'Central Government';
  location: string;
  type: 'Full-time' | 'Part-time';
  shift: 'Day' | 'Night';
  description: string;
  requirements: string[];
  startDate: string;
  endDate: string;
  applySteps: string[];
  hrEmail: string;
  officialUrl: string;
}

export interface ExamListing {
  id: string;
  title: string;
  category: 'PG-CET' | 'UPSC' | 'SSC' | 'State Govt';
  examDate: string;
  applySteps: string[];
  studyMaterials: { name: string; url: string }[];
  description: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  trackingId: string;
  status: 'Initiated' | 'Under Review' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  appliedDate: string;
  messages: { from: 'HR' | 'System'; text: string; date: string }[];
}

/** Indicative PG-CET (Karnataka-style) college profile for score-based matching */
export interface CollegeListing {
  id: string;
  name: string;
  location: string;
  /** Indicative minimum PG-CET score (out of 600) for guidance; user is shown the college if their score is >= this */
  minPgCetScore: number;
  feesStructure: string;
  facilities: string[];
  about: string;
  pgHostelAvailable: boolean;
}

export const PG_CET_SCORE_MAX = 600;

export const PG_CET_COLLEGES: CollegeListing[] = [
  {
    id: 'rvce',
    name: 'R.V. College of Engineering',
    location: 'Bangalore, Karnataka',
    minPgCetScore: 560,
    feesStructure:
      'Govt quota: approx. ₹2.4 L/year (tuition). Management: approx. ₹4.2 L/year. Includes exam & lab fees; hostel billed separately.',
    facilities: ['Central library', 'Research labs', 'Incubation centre', 'Sports complex', '24×7 Wi‑Fi', 'Placement cell'],
    about:
      'Autonomous institute known for strong industry ties and postgraduate programmes in core engineering and CSE specialisations.',
    pgHostelAvailable: true,
  },
  {
    id: 'msrit',
    name: 'M.S. Ramaiah Institute of Technology',
    location: 'Bangalore, Karnataka',
    minPgCetScore: 535,
    feesStructure:
      'Approx. ₹2.1–3.8 L/year depending on quota and branch. Mess and hostel charges are on actuals per semester.',
    facilities: ['Digital classrooms', 'Hospital tie-ups', 'Auditorium', 'Gym', 'Cafeteria', 'Transport'],
    about:
      'Deemed-to-be university campus with wide PG intake; popular for M.Tech in structural, thermal, and IT-related streams.',
    pgHostelAvailable: true,
  },
  {
    id: 'bmsce',
    name: 'B.M.S. College of Engineering',
    location: 'Bangalore, Karnataka',
    minPgCetScore: 520,
    feesStructure:
      'Govt seat: approx. ₹1.9 L/year. Private: approx. ₹3.2 L/year. Other fees (exam, insurance) as per circular.',
    facilities: ['Heritage campus', 'CoE labs', 'NSS & clubs', 'Banking kiosk', 'Counselling cell'],
    about:
      'One of the older autonomous engineering colleges in the state; steady PG-CET intake for M.Tech across departments.',
    pgHostelAvailable: false,
  },
  {
    id: 'pesu',
    name: 'PES University',
    location: 'Bangalore, Karnataka',
    minPgCetScore: 505,
    feesStructure:
      'PG programme: approx. ₹3.0–4.5 L/year by specialisation. Scholarship slabs published on the admissions portal.',
    facilities: ['Innovation hub', 'Industry labs', 'Hostel blocks', 'Mentorship programme', 'International collaborations'],
    about:
      'Private university with emphasis on research-oriented PG degrees and industry co-developed curricula.',
    pgHostelAvailable: true,
  },
  {
    id: 'dsce',
    name: 'Dayananda Sagar College of Engineering',
    location: 'Bangalore, Karnataka',
    minPgCetScore: 465,
    feesStructure:
      'Approx. ₹1.6–2.9 L/year (quota dependent). Hostel: approx. ₹90k–1.2 L/year including mess (indicative).',
    facilities: ['Smart classrooms', 'Central computing', 'Sports grounds', 'Anti-ragging cell', 'Alumni network'],
    about:
      'Large intake across branches; suitable for candidates seeking M.Tech with moderate to strong PG-CET performance.',
    pgHostelAvailable: true,
  },
  {
    id: 'nmam',
    name: 'N.M.A.M. Institute of Technology',
    location: 'Nitte, Karnataka',
    minPgCetScore: 410,
    feesStructure:
      'Approx. ₹1.4–2.2 L/year for PG programmes. Additional one-time admission and uniform fees as per prospectus.',
    facilities: ['Rural campus', 'Hostels', 'Training & placement', 'IEEE student branch', 'Medical room'],
    about:
      'Affiliated college with growing PG offerings; attractive for students preferring a quieter campus with residential options.',
    pgHostelAvailable: true,
  },
  {
    id: 'acs',
    name: 'ACS College of Engineering',
    location: 'Bangalore, Karnataka',
    minPgCetScore: 320,
    feesStructure:
      'Approx. ₹1.1–1.8 L/year. Payment plans and fee waiver categories listed during KEA / institutional counselling.',
    facilities: ['Library', 'Computer labs', 'Workshops', 'Student affairs office'],
    about:
      'Entry-level competitive scores often align with this tier; verify latest cut-offs during official counselling rounds.',
    pgHostelAvailable: false,
  },
];

/** Linear “score % of max” for display (not statistical population percentile). */
export function getPgCetScorePercentOfMax(score: number, totalMarks: number = PG_CET_SCORE_MAX): string {
  if (totalMarks <= 0) return '0.0';
  return Math.min(100, Math.max(0, (score / totalMarks) * 100)).toFixed(1);
}

/** Colleges whose indicative minimum score is met or exceeded by the candidate (best-matching first). */
export function getMatchingCollegesForPgCetScore(score: number): CollegeListing[] {
  return PG_CET_COLLEGES.filter((c) => score >= c.minPgCetScore).sort((a, b) => b.minPgCetScore - a.minPgCetScore);
}

export const JOBS: JobListing[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'IBM',
    department: 'IT',
    location: 'Bangalore, India',
    type: 'Full-time',
    shift: 'Day',
    description: 'Join our cloud platform team to build scalable services. You will work on microservices architecture using Go and Kubernetes.',
    requirements: ['React', 'Next.js', 'Node.js', 'Kubernetes'],
    startDate: '2024-04-01',
    endDate: '2024-05-30',
    applySteps: ['Upload Resume', 'Technical Assessment', 'HR Interview'],
    hrEmail: 'hr-tech@ibm-careers.com',
    officialUrl: 'https://ibm.com/jobs'
  },
  {
    id: '2',
    title: 'Data Analyst',
    company: 'Wipro',
    department: 'IT',
    location: 'Hyderabad, India',
    type: 'Full-time',
    shift: 'Day',
    description: 'Analyze complex datasets to drive business decisions. Experience with Python and Tableau is a must.',
    requirements: ['SQL', 'Python', 'Power BI'],
    startDate: '2024-04-10',
    endDate: '2024-06-15',
    applySteps: ['Submit Application', 'Data Challenge', 'Final Interview'],
    hrEmail: 'recruitment@wipro.com',
    officialUrl: 'https://wipro.com/careers'
  },
  {
    id: 'it-3',
    title: 'System Architect',
    company: 'TCS',
    department: 'IT',
    location: 'Pune, India',
    type: 'Full-time',
    shift: 'Day',
    description: 'Design robust and scalable systems for international banking clients.',
    requirements: ['Java', 'Spring Boot', 'AWS', 'Microservices'],
    startDate: '2024-04-05',
    endDate: '2024-05-20',
    applySteps: ['Technical Rounds', 'Managerial Round', 'HR Round'],
    hrEmail: 'careers@tcs.com',
    officialUrl: 'https://tcs.com/careers'
  },
  {
    id: 'non-it-1',
    title: 'Operations Manager',
    company: 'Amazon Logistics',
    department: 'Non-IT',
    location: 'Chennai, India',
    type: 'Full-time',
    shift: 'Day',
    description: 'Oversee warehouse operations and supply chain efficiency.',
    requirements: ['Supply Chain Management', 'Team Leadership', 'Six Sigma'],
    startDate: '2024-04-01',
    endDate: '2024-05-15',
    applySteps: ['Initial Screening', 'Case Study', 'Leadership Interview'],
    hrEmail: 'ops-hiring@amazon.com',
    officialUrl: 'https://amazon.jobs'
  },
  {
    id: 'gov-1',
    title: 'Administrative Officer',
    company: 'KPSC',
    department: 'Government',
    location: 'Karnataka, India',
    type: 'Full-time',
    shift: 'Day',
    description: 'Manage administrative tasks for state government departments.',
    requirements: ['Bachelor Degree', 'State Language Proficiency', 'General Studies'],
    startDate: '2024-05-01',
    endDate: '2024-06-01',
    applySteps: ['OTR Registration', 'Preliminary Exam', 'Main Exam', 'Interview'],
    hrEmail: 'support@kpsc.gov.in',
    officialUrl: 'https://kpsc.kar.nic.in'
  },
  {
    id: 'c-gov-1',
    title: 'Station Master',
    company: 'Indian Railways (RRB)',
    department: 'Central Government',
    location: 'Various Locations',
    type: 'Full-time',
    shift: 'Night',
    description: 'Responsible for train operations and safety at stations. Candidates must pass medical fitness.',
    requirements: ['Any Graduation', 'Medical Fitness', 'Aptitude Test'],
    startDate: '2024-03-15',
    endDate: '2024-04-30',
    applySteps: ['CBT Stage 1', 'CBT Stage 2', 'Document Verification'],
    hrEmail: 'helpdesk@rrb.gov.in',
    officialUrl: 'https://indianrailways.gov.in'
  },
  {
    id: 'c-gov-2',
    title: 'Assistant Section Officer',
    company: 'SSC CGL',
    department: 'Central Government',
    location: 'Delhi, India',
    type: 'Full-time',
    shift: 'Day',
    description: 'Working in various Central Government Ministries and Departments.',
    requirements: ['Bachelor Degree', 'Reasoning', 'Quantitative Aptitude'],
    startDate: '2024-04-20',
    endDate: '2024-06-10',
    applySteps: ['Tier 1 Exam', 'Tier 2 Exam', 'CPT Test'],
    hrEmail: 'enquiry@sscher.com',
    officialUrl: 'https://ssc.nic.in'
  }
];

export const EXAMS: ExamListing[] = [
  {
    id: 'pgcet-1',
    title: 'Karnataka PG-CET 2024',
    category: 'PG-CET',
    examDate: '2024-07-20',
    applySteps: [
      'Fill Online Application',
      'Pay Application Fee',
      'Upload Documents',
      'Download Admit Card'
    ],
    studyMaterials: [
      { name: 'Previous Year Papers', url: '#' },
      { name: 'Syllabus PDF', url: '#' },
      { name: 'Mock Tests', url: '#' }
    ],
    description: 'Post Graduate Common Entrance Test for M.Tech, MCA, and MBA courses in Karnataka.'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: '1',
    userId: 'user-1',
    trackingId: 'OPT-KB92XJ7',
    status: 'Under Review',
    appliedDate: '2024-04-10',
    messages: [
      { from: 'System', text: 'Application successfully submitted.', date: '2024-04-10' },
      { from: 'HR', text: 'Thank you for applying. We are reviewing your profile.', date: '2024-04-12' }
    ]
  }
];

export const getHrEmail = (job: Partial<JobListing>) => {
  if (job.hrEmail) return job.hrEmail;
  return `hr@${job.company?.toLowerCase().replace(/\s+/g, '') || 'opportunet'}.com`;
};
