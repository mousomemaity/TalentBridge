import { EmploymentType, RemoteType } from '../enums';

export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'HOURLY' | 'MONTHLY' | 'YEARLY';
}

export interface ILocation {
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isRemote?: boolean;
}

export interface IContactInfo {
  phone?: string;
  alternateEmail?: string;
  linkedin?: string;
  github?: string;
  portfolioWebsite?: string;
}

export interface IWorkExperience {
  title: string;
  companyName: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
}

export interface ISkillItem {
  name: string;
  yearsOfExperience?: number;
  proficiency?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface IProject {
  title: string;
  description?: string;
  url?: string;
  technologies: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface ICertification {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ILanguage {
  language: string;
  proficiency: 'BASIC' | 'CONVERSATIONAL' | 'PROFICIENT' | 'FLUENT' | 'NATIVE';
}

export interface IJobPreferences {
  desiredTitles: string[];
  employmentTypes: EmploymentType[];
  remotePreferences: RemoteType[];
  preferredLocations: string[];
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
}

export interface IResumeParsedResult {
  extractedSkills: string[];
  workExperience: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }>;
  education: Array<{
    institution?: string;
    degree?: string;
    graduationYear?: number;
  }>;
  summary?: string;
  rawText?: string;
}

export interface IApplicationAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface IMatchScoreSnapshot {
  totalScore: number;
  modelVersion: string;
  calculatedAt: Date;
}

export interface IComponentBreakdown {
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  locationScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface ICompanySettings {
  website?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  linkedinUrl?: string;
  twitterUrl?: string;
  careersPageUrl?: string;
  autoRejectBelowMatchScore?: number;
}

export interface IJobAlertFilters {
  employmentTypes?: EmploymentType[];
  remoteTypes?: RemoteType[];
  salaryMin?: number;
  skills?: string[];
}
