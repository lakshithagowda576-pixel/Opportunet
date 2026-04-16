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
