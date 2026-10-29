import { Types } from 'mongoose';
import {
  AccountStatus,
  ApplicationStatus,
  CompanyMemberRole,
  EmploymentType,
  JobAlertFrequency,
  JobStatus,
  MembershipStatus,
  NotificationType,
  PipelineStageCategory,
  RemoteType,
  ResumeParseStatus,
  UserRole,
} from '../src/enums';

// Deterministic ObjectIds for seed references
export const SEED_IDS = {
  users: {
    candidate1: new Types.ObjectId('650000000000000000000001'),
    candidate2: new Types.ObjectId('650000000000000000000002'),
    employer1: new Types.ObjectId('650000000000000000000003'),
    employer2: new Types.ObjectId('650000000000000000000004'),
    admin: new Types.ObjectId('650000000000000000000005'),
  },
  companies: {
    stripe: new Types.ObjectId('650000000000000000000011'),
    finflow: new Types.ObjectId('650000000000000000000012'),
  },
  candidateProfiles: {
    candidate1: new Types.ObjectId('650000000000000000000021'),
    candidate2: new Types.ObjectId('650000000000000000000022'),
  },
  resumes: {
    candidate1Resume1: new Types.ObjectId('650000000000000000000031'),
    candidate2Resume1: new Types.ObjectId('650000000000000000000032'),
  },
  jobs: {
    fullstackJob: new Types.ObjectId('650000000000000000000041'),
    frontendJob: new Types.ObjectId('650000000000000000000042'),
  },
  stages: {
    applied: new Types.ObjectId('650000000000000000000051'),
    screening: new Types.ObjectId('650000000000000000000052'),
    technical: new Types.ObjectId('650000000000000000000053'),
    offer: new Types.ObjectId('650000000000000000000054'),
  },
  applications: {
    app1: new Types.ObjectId('650000000000000000000061'),
    app2: new Types.ObjectId('650000000000000000000062'),
  },
  matchResults: {
    match1: new Types.ObjectId('650000000000000000000071'),
    match2: new Types.ObjectId('650000000000000000000072'),
  },
};

export const sampleUsers = [
  {
    _id: SEED_IDS.users.candidate1,
    email: 'david.kim@example.com',
    passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6P3nKz84R8gS9lG', // 'Password123!'
    role: UserRole.CANDIDATE,
    accountStatus: AccountStatus.ACTIVE,
    lastLoginAt: new Date(),
  },
  {
    _id: SEED_IDS.users.candidate2,
    email: 'sarah.chen@example.com',
    passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6P3nKz84R8gS9lG',
    role: UserRole.CANDIDATE,
    accountStatus: AccountStatus.ACTIVE,
    lastLoginAt: new Date(),
  },
  {
    _id: SEED_IDS.users.employer1,
    email: 'emma.watson@talentbridge.recruiter.com',
    passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6P3nKz84R8gS9lG',
    role: UserRole.EMPLOYER,
    accountStatus: AccountStatus.ACTIVE,
    lastLoginAt: new Date(),
  },
  {
    _id: SEED_IDS.users.employer2,
    email: 'michael.brown@talentbridge.recruiter.com',
    passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6P3nKz84R8gS9lG',
    role: UserRole.EMPLOYER,
    accountStatus: AccountStatus.ACTIVE,
    lastLoginAt: new Date(),
  },
  {
    _id: SEED_IDS.users.admin,
    email: 'admin@talentbridge.internal.com',
    passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6P3nKz84R8gS9lG',
    role: UserRole.ADMIN,
    accountStatus: AccountStatus.ACTIVE,
    lastLoginAt: new Date(),
  },
];

export const sampleCompanies = [
  {
    _id: SEED_IDS.companies.stripe,
    name: 'Stripe Global',
    slug: 'stripe-global',
    description: 'Financial infrastructure platform for the internet.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128',
    industry: 'Financial Technology',
    settings: {
      website: 'https://stripe.com',
      size: '1000+',
      linkedinUrl: 'https://linkedin.com/company/stripe',
      autoRejectBelowMatchScore: 40,
    },
  },
  {
    _id: SEED_IDS.companies.finflow,
    name: 'FinFlow AI',
    slug: 'finflow-ai',
    description: 'Autonomous financial intelligence and real-time reconciliation.',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128',
    industry: 'Artificial Intelligence',
    settings: {
      website: 'https://finflow.ai',
      size: '51-200',
      autoRejectBelowMatchScore: 50,
    },
  },
];

export const sampleCompanyMembers = [
  {
    user: SEED_IDS.users.employer1,
    company: SEED_IDS.companies.stripe,
    role: CompanyMemberRole.OWNER,
    membershipStatus: MembershipStatus.ACTIVE,
  },
  {
    user: SEED_IDS.users.employer2,
    company: SEED_IDS.companies.stripe,
    role: CompanyMemberRole.RECRUITER,
    membershipStatus: MembershipStatus.ACTIVE,
  },
];

export const sampleCandidateProfiles = [
  {
    _id: SEED_IDS.candidateProfiles.candidate1,
    user: SEED_IDS.users.candidate1,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256',
    headline: 'Senior Fullstack Engineer (TypeScript, NestJS, React, MongoDB)',
    summary:
      'Passionate software engineer with 7+ years of experience scaling modern web applications and microservices.',
    contactInfo: {
      phone: '+1-415-555-0192',
      alternateEmail: 'david.personal@kim.dev',
      linkedin: 'https://linkedin.com/in/davidkim-dev',
      github: 'https://github.com/davidkim',
      portfolioWebsite: 'https://davidkim.dev',
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      isRemote: true,
    },
    experience: [
      {
        title: 'Senior Software Engineer',
        companyName: 'TechScale Inc.',
        location: 'San Francisco, CA',
        startDate: new Date('2021-03-01'),
        endDate: null,
        isCurrent: true,
        description: 'Led architecture of TypeScript microservices with MongoDB and Redis.',
      },
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: new Date('2014-09-01'),
        endDate: new Date('2018-05-15'),
        grade: '3.85 GPA',
      },
    ],
    skills: [
      { name: 'TypeScript', yearsOfExperience: 6, proficiency: 'EXPERT' },
      { name: 'React', yearsOfExperience: 6, proficiency: 'EXPERT' },
      { name: 'Node.js', yearsOfExperience: 7, proficiency: 'EXPERT' },
      { name: 'NestJS', yearsOfExperience: 4, proficiency: 'ADVANCED' },
      { name: 'MongoDB', yearsOfExperience: 5, proficiency: 'ADVANCED' },
      { name: 'AWS', yearsOfExperience: 4, proficiency: 'ADVANCED' },
    ],
    projects: [
      {
        title: 'OpenDistributedQueue',
        description: 'Lightweight distributed worker queue built with Node.js and MongoDB.',
        url: 'https://github.com/davidkim/opendq',
        technologies: ['TypeScript', 'MongoDB', 'Docker'],
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect - Associate',
        issuingOrganization: 'Amazon Web Services',
        issueDate: new Date('2023-01-15'),
      },
    ],
    languages: [{ language: 'English', proficiency: 'NATIVE' }],
    jobPreferences: {
      desiredTitles: ['Senior Fullstack Engineer', 'Staff Engineer', 'Lead Backend Engineer'],
      employmentTypes: [EmploymentType.FULL_TIME],
      remotePreferences: [RemoteType.REMOTE, RemoteType.HYBRID],
      preferredLocations: ['San Francisco, CA', 'Remote'],
      minSalary: 140000,
      maxSalary: 180000,
      currency: 'USD',
    },
  },
];

export const sampleResumes = [
  {
    _id: SEED_IDS.resumes.candidate1Resume1,
    candidate: SEED_IDS.candidateProfiles.candidate1,
    fileName: 'David_Kim_Senior_Fullstack_2026.pdf',
    storageKey: 'resumes/private/650000000000000000000021/david_kim_2026.enc',
    mimeType: 'application/pdf',
    fileSize: 245120,
    isDefault: true,
    parseStatus: ResumeParseStatus.PARSED,
    parserVersion: 'talentbridge-parser-v2.1',
    parsedResult: {
      extractedSkills: ['TypeScript', 'React', 'Node.js', 'NestJS', 'MongoDB', 'AWS', 'Docker'],
      workExperience: [
        {
          title: 'Senior Software Engineer',
          company: 'TechScale Inc.',
          duration: '2021 - Present',
          description: 'Distributed microservices architecture.',
        },
      ],
      education: [
        {
          institution: 'UC Berkeley',
          degree: 'B.S. in Computer Science',
          graduationYear: 2018,
        },
      ],
      summary: 'Senior Fullstack Engineer with 7+ years of experience.',
    },
  },
];

export const samplePipelineStages = [
  {
    _id: SEED_IDS.stages.applied,
    company: SEED_IDS.companies.stripe,
    name: 'Applied',
    position: 0,
    category: PipelineStageCategory.APPLIED,
    slaDays: 2,
    slaHours: 0,
  },
  {
    _id: SEED_IDS.stages.screening,
    company: SEED_IDS.companies.stripe,
    name: 'HR Screening',
    position: 1,
    category: PipelineStageCategory.SCREENING,
    slaDays: 3,
    slaHours: 0,
  },
  {
    _id: SEED_IDS.stages.technical,
    company: SEED_IDS.companies.stripe,
    name: 'Technical Interview',
    position: 2,
    category: PipelineStageCategory.INTERVIEW,
    slaDays: 5,
    slaHours: 0,
  },
  {
    _id: SEED_IDS.stages.offer,
    company: SEED_IDS.companies.stripe,
    name: 'Offer & Closing',
    position: 3,
    category: PipelineStageCategory.OFFER,
    slaDays: 3,
    slaHours: 0,
  },
];

export const sampleJobs = [
  {
    _id: SEED_IDS.jobs.fullstackJob,
    company: SEED_IDS.companies.stripe,
    title: 'Senior Fullstack Engineer',
    slug: 'stripe-senior-fullstack-engineer-2026',
    description:
      'Join our Core Platform team to build ultra-reliable, high-throughput developer tools and dashboards.',
    requirements: [
      '5+ years professional software development experience',
      'Strong proficiency in TypeScript, React, and Node.js / NestJS',
      'Hands-on experience with MongoDB document modeling and indexing',
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'NestJS', 'MongoDB', 'AWS'],
    salaryRange: {
      min: 140000,
      max: 175000,
      currency: 'USD',
      period: 'YEARLY',
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      isRemote: true,
    },
    employmentType: EmploymentType.FULL_TIME,
    remoteType: RemoteType.REMOTE,
    status: JobStatus.PUBLISHED,
    publishedAt: new Date(),
  },
  {
    _id: SEED_IDS.jobs.frontendJob,
    company: SEED_IDS.companies.stripe,
    title: 'Lead Frontend Engineer',
    slug: 'stripe-lead-frontend-engineer-2026',
    description: 'Lead the architectural transformation of customer-facing dashboards.',
    requirements: ['7+ years experience with modern React, Next.js, and design systems'],
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
    salaryRange: {
      min: 155000,
      max: 190000,
      currency: 'USD',
      period: 'YEARLY',
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      isRemote: true,
    },
    employmentType: EmploymentType.FULL_TIME,
    remoteType: RemoteType.HYBRID,
    status: JobStatus.PUBLISHED,
    publishedAt: new Date(),
  },
];

export const sampleMatchResults = [
  {
    _id: SEED_IDS.matchResults.match1,
    candidate: SEED_IDS.candidateProfiles.candidate1,
    job: SEED_IDS.jobs.fullstackJob,
    totalScore: 94,
    componentBreakdown: {
      skillsScore: 96,
      experienceScore: 92,
      educationScore: 90,
      locationScore: 100,
      matchedSkills: ['TypeScript', 'React', 'Node.js', 'NestJS', 'MongoDB', 'AWS'],
      missingSkills: ['GraphQL'],
    },
    modelVersion: 'talentbridge-ai-v1.2',
    calculatedAt: new Date(),
  },
];

export const sampleApplications = [
  {
    _id: SEED_IDS.applications.app1,
    job: SEED_IDS.jobs.fullstackJob,
    candidate: SEED_IDS.candidateProfiles.candidate1,
    selectedResume: SEED_IDS.resumes.candidate1Resume1,
    coverLetter:
      'I am thrilled to apply for the Senior Fullstack Engineer position. My background with TypeScript, NestJS, and MongoDB matches your platform requirements perfectly.',
    answers: [
      {
        questionId: 'q1',
        question: 'How many years of TypeScript production experience do you have?',
        answer: '6 years in production environments.',
      },
    ],
    currentStage: SEED_IDS.stages.technical,
    status: ApplicationStatus.INTERVIEWING,
    matchResult: SEED_IDS.matchResults.match1,
    matchScoreSnapshot: {
      totalScore: 94,
      modelVersion: 'talentbridge-ai-v1.2',
      calculatedAt: new Date(),
    },
  },
];

export const sampleApplicationStageHistories = [
  {
    application: SEED_IDS.applications.app1,
    previousStage: SEED_IDS.stages.applied,
    nextStage: SEED_IDS.stages.screening,
    actor: SEED_IDS.users.employer1,
    notes: 'Strong resume and 94% AI match. Fast-tracking to screening.',
    createdAt: new Date(Date.now() - 4 * 86400000),
  },
  {
    application: SEED_IDS.applications.app1,
    previousStage: SEED_IDS.stages.screening,
    nextStage: SEED_IDS.stages.technical,
    actor: SEED_IDS.users.employer2,
    notes: 'Candidate excelled in initial screening. Scheduled technical interview.',
    createdAt: new Date(Date.now() - 1 * 86400000),
  },
];

export const sampleSavedJobs = [
  {
    candidate: SEED_IDS.candidateProfiles.candidate1,
    job: SEED_IDS.jobs.frontendJob,
  },
];

export const sampleSavedSearches = [
  {
    candidate: SEED_IDS.candidateProfiles.candidate1,
    keywords: 'Senior Fullstack TypeScript',
    location: 'Remote',
    filters: {
      employmentTypes: [EmploymentType.FULL_TIME],
      remoteTypes: [RemoteType.REMOTE],
      salaryMin: 130000,
      skills: ['TypeScript', 'NestJS', 'MongoDB'],
    },
    frequency: JobAlertFrequency.DAILY,
    isActive: true,
    lastNotifiedAt: new Date(),
  },
];

export const sampleNotifications = [
  {
    recipient: SEED_IDS.users.candidate1,
    type: NotificationType.STAGE_CHANGED,
    title: 'Application Advanced',
    message: 'Congratulations! Your application for Senior Fullstack Engineer has moved to Technical Interview.',
    relatedEntity: {
      entityType: 'Application',
      entityId: SEED_IDS.applications.app1,
    },
    isRead: false,
  },
  {
    recipient: SEED_IDS.users.employer1,
    type: NotificationType.APPLICATION_RECEIVED,
    title: 'New High-Match Applicant',
    message: 'David Kim applied for Senior Fullstack Engineer with a 94% AI match score.',
    relatedEntity: {
      entityType: 'Application',
      entityId: SEED_IDS.applications.app1,
    },
    isRead: true,
    readAt: new Date(),
  },
];
