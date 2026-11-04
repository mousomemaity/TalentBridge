export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
  timeoutMs?: number;
}

export interface ParsedResumeExperience {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface ParsedResumeEducation {
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

export interface ParsedResumeProject {
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
}

export interface ParsedResumeCertification {
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills: string[];
  yearsExperience?: number;
  experiences: ParsedResumeExperience[];
  educations: ParsedResumeEducation[];
  projects: ParsedResumeProject[];
  certifications: ParsedResumeCertification[];
  confidenceScore: number; // 0-100
  missingFieldsWarning?: string[];
  rawTextPreview?: string;
}

export interface ResumeAnalysisResult {
  identifiedSkills: string[];
  strengths: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  roleSpecificRecommendations?: string[];
  score: number; // 0-100
  overview: string;
}

export interface MatchScoreBreakdown {
  skillsScore: number; // 0 - 50
  experienceScore: number; // 0 - 25
  locationScore: number; // 0 - 15
  salaryScore: number; // 0 - 10
  total: number; // 0 - 100
}

export interface JobMatchExplanation {
  jobId: string;
  candidateId: string;
  overallScore: number;
  explainability: {
    scoreBreakdown: MatchScoreBreakdown;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
    governanceNotice: string;
  };
}

export interface JobDescriptionDraftResult {
  title: string;
  description: string;
  suggestedSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  draftNotice: string;
}

export interface BiasCheckResult {
  hasBiasFlags: boolean;
  flags: Array<{
    word: string;
    suggestion: string;
    reason: string;
  }>;
  inclusiveScore: number; // 0-100
}

export interface InterviewQuestionsResult {
  jobTitle: string;
  questions: Array<{
    category: 'technical' | 'behavioral' | 'role_specific';
    question: string;
    targetCompetency: string;
    expectedIndicators: string[];
  }>;
}

export interface CandidateRecruiterSummaryResult {
  candidateId: string;
  executiveSummary: string;
  keyStrengths: string[];
  growthAreas: string[];
  recommendedRoles: string[];
  draftNotice: string;
}
