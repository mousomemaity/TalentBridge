import { Injectable, Logger } from '@nestjs/common';
import { LlmClientService } from './llm-client.service';
import { MatchScoreBreakdown, JobMatchExplanation } from '../interfaces/ai.interfaces';
import { WorkplaceType } from '../../../common/constants/roles.enum';

export interface CandidateMatchingInput {
  userId: string;
  skills: Array<{ name: string; level?: string; yearsExperience?: number }>;
  yearsExperience?: number;
  location?: string;
  remoteOnly?: boolean;
  targetSalaryMin?: number;
}

export interface JobMatchingInput {
  jobId: string;
  title: string;
  skills: string[];
  workplaceType?: WorkplaceType | string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  requirements?: string[];
}

@Injectable()
export class JobMatcherService {
  private readonly logger = new Logger(JobMatcherService.name);

  // Configurable transparent scoring weights totaling 100
  readonly WEIGHTS = {
    SKILLS: 50,
    EXPERIENCE: 25,
    LOCATION_WORKPLACE: 15,
    SALARY: 10,
  };

  constructor(private readonly llmClient: LlmClientService) {}

  computeMatch(candidate: CandidateMatchingInput, job: JobMatchingInput): JobMatchExplanation {
    const candidateSkillsMap = new Map<string, { level?: string; years?: number }>();
    for (const s of candidate.skills || []) {
      candidateSkillsMap.set(s.name.trim().toLowerCase(), {
        level: s.level,
        years: s.yearsExperience,
      });
    }

    const jobSkills = job.skills || [];
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const reqSkill of jobSkills) {
      const lower = reqSkill.trim().toLowerCase();
      if (candidateSkillsMap.has(lower)) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }

    // 1. Required Skill Coverage Score (0 - 50)
    let skillsScore = this.WEIGHTS.SKILLS;
    if (jobSkills.length > 0) {
      const ratio = matchedSkills.length / jobSkills.length;
      skillsScore = Math.round(ratio * this.WEIGHTS.SKILLS);
    }

    // 2. Experience Level Fit Score (0 - 25)
    const candYears = candidate.yearsExperience || 0;
    let experienceScore = 15; // default moderate score
    if (candYears >= 5) {
      experienceScore = 25;
    } else if (candYears >= 2) {
      experienceScore = 20;
    } else if (candYears >= 1) {
      experienceScore = 16;
    } else {
      experienceScore = 12;
    }

    // 3. Location and Remote Work Compatibility Score (0 - 15)
    let locationScore = 10;
    const isJobRemote = job.workplaceType === WorkplaceType.REMOTE || String(job.workplaceType).toUpperCase() === 'REMOTE';
    const isCandidateRemoteOnly = Boolean(candidate.remoteOnly);

    if (isJobRemote) {
      locationScore = 15;
    } else if (isCandidateRemoteOnly) {
      // Candidate wants remote only, but job is onsite or hybrid
      locationScore = job.workplaceType === WorkplaceType.HYBRID ? 7 : 2;
    } else if (candidate.location && job.location) {
      const candLoc = candidate.location.toLowerCase();
      const jobLoc = job.location.toLowerCase();
      if (candLoc.includes(jobLoc) || jobLoc.includes(candLoc)) {
        locationScore = 15;
      } else {
        locationScore = 8;
      }
    }

    // 4. Salary Expectation Overlap Score (0 - 10)
    let salaryScore = 10;
    if (candidate.targetSalaryMin && job.salaryMax) {
      if (candidate.targetSalaryMin > job.salaryMax) {
        const delta = candidate.targetSalaryMin - job.salaryMax;
        const ratioOver = delta / job.salaryMax;
        salaryScore = Math.max(0, Math.round(10 - ratioOver * 20));
      } else {
        salaryScore = 10;
      }
    } else if (candidate.targetSalaryMin && job.salaryMin && candidate.targetSalaryMin <= job.salaryMin) {
      salaryScore = 10;
    }

    const totalScore = Math.min(100, Math.max(0, skillsScore + experienceScore + locationScore + salaryScore));

    const breakdown: MatchScoreBreakdown = {
      skillsScore,
      experienceScore,
      locationScore,
      salaryScore,
      total: totalScore,
    };

    const explanationSummary = jobSkills.length > 0
      ? `${matchedSkills.length} of ${jobSkills.length} required skills match. ${
          missingSkills.length > 0 ? `Missing: ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? '...' : ''}.` : 'All required skills matched.'
        } Experience evaluated at ${candYears} years against requirements.`
      : `Broad role match score computed across candidate experience (${candYears} years) and workplace criteria.`;

    return {
      jobId: job.jobId,
      candidateId: candidate.userId,
      overallScore: totalScore,
      explainability: {
        scoreBreakdown: breakdown,
        matchedSkills,
        missingSkills,
        summary: explanationSummary,
        governanceNotice: 'AI match scores are transparent decision aids and never automatically reject candidates or make autonomous employment determinations.',
      },
    };
  }
}
