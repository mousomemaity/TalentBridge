export type UserRole = "CAN" | "REC" | "HM" | "INT" | "CA" | "SA" | "PUB";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  tenantId?: string; // Company / Tenant ID for employer roles
  candidateId?: string;
}

export type JobType = "full-time" | "part-time" | "contract" | "internship" | "remote";
export type WorkplaceType = "remote" | "hybrid" | "on-site";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  culture: string[];
  benefits: string[];
  rating: number;
  openJobsCount: number;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  department: string;
  location: string;
  workplaceType: WorkplaceType;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedAt: string;
  deadline?: string;
  status: "open" | "draft" | "paused" | "closed";
  applicantsCount: number;
  matchScore?: number; // AI match percentage for current candidate
  isSaved?: boolean;
}

export interface JobFilterParams {
  query?: string;
  location?: string;
  workplaceType?: WorkplaceType[];
  jobType?: JobType[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  skills?: string[];
  sortBy?: "relevance" | "newest" | "salary_high" | "best_match";
  page?: number;
  limit?: number;
}

export type KanbanStage =
  | "applied"
  | "screening"
  | "interview"
  | "assessment"
  | "offer"
  | "hired"
  | "rejected";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateAvatar?: string;
  candidateHeadline?: string;
  stage: KanbanStage;
  appliedAt: string;
  updatedAt: string;
  matchScore: number;
  matchReasons?: {
    matchedSkills: string[];
    missingSkills: string[];
    experienceFit: string;
  };
  resumeUrl?: string;
  resumeFileName?: string;
  coverLetter?: string;
  recruiterNotes?: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }[];
  rating?: number; // 1-5 rating
}

export interface CandidateSkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience: number;
}

export interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface CandidateEducation {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  avatarUrl?: string;
  skills: CandidateSkill[];
  experiences: CandidateExperience[];
  educations: CandidateEducation[];
  preferences: {
    desiredRoles: string[];
    desiredLocations: string[];
    workplaceType: WorkplaceType[];
    salaryFloor: number;
    noticePeriodWeeks: number;
  };
  completenessPercentage: number;
}

export interface ResumeItem {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  isDefault: boolean;
  parsedData?: {
    skillsDetected: string[];
    experienceSummary: string;
    educationSummary: string;
  };
}

export interface JobAlert {
  id: string;
  title: string;
  query: string;
  location: string;
  frequency: "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  applicationId: string;
  jobTitle: string;
  candidateName: string;
  companyName: string;
  interviewerName: string;
  interviewType: "Screening" | "Technical" | "Cultural Fit" | "Final Round";
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  status: "scheduled" | "completed" | "reschedule_requested" | "cancelled";
}

export interface AssessmentItem {
  id: string;
  title: string;
  jobTitle: string;
  durationMinutes: number;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  score?: number;
  totalQuestions: number;
}

export interface OfferItem {
  id: string;
  jobTitle: string;
  companyName: string;
  compensation: string;
  startDate: string;
  deadline: string;
  status: "pending" | "accepted" | "declined";
  letterUrl: string;
}

export interface DashboardMetrics {
  openJobs: number;
  totalApplicants: number;
  interviewsToday: number;
  pendingOffers: number;
  timeToHireDays: number;
  funnelData: {
    stage: string;
    count: number;
    color: string;
  }[];
}
