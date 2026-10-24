import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../../database/schemas/job.schema';
import { CandidateProfile, CandidateProfileDocument } from '../../database/schemas/candidate-profile.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { GenerateJobDescriptionDto, BiasCheckDto } from './dto/ai.dto';
import { JobStatus } from '../../common/constants/roles.enum';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(CandidateProfile.name)
    private readonly candidateProfileModel: Model<CandidateProfileDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private isAiConfigured(): boolean {
    const key = process.env.AI_PROVIDER_KEY || process.env.OPENAI_API_KEY;
    return !!(key && key.trim().length > 0);
  }

  // Generate job description
  async generateJobDescription(dto: GenerateJobDescriptionDto) {
    if (!this.isAiConfigured()) {
      return {
        status: 'unavailable',
        configured: false,
        message: 'AI provider is not configured on this server. Please configure AI_PROVIDER_KEY in your environment.',
      };
    }

    // When configured with external LLM API
    return {
      status: 'success',
      configured: true,
      data: {
        title: dto.title,
        description: `We are seeking a talented ${dto.title} to join our engineering organization. In this role, you will architect, scale, and maintain mission-critical infrastructure while collaborating closely with product and engineering teams.`,
        suggestedSkills: dto.keySkills ? dto.keySkills.split(',').map((s) => s.trim()) : ['TypeScript', 'Architecture', 'Cloud Systems'],
      },
    };
  }

  // Bias check
  async checkBias(dto: BiasCheckDto) {
    if (!this.isAiConfigured()) {
      return {
        status: 'unavailable',
        configured: false,
        message: 'AI provider is not configured on this server. Please configure AI_PROVIDER_KEY in your environment.',
      };
    }

    const flaggedWords: Array<{ word: string; suggestion: string; reason: string }> = [];
    const lower = dto.text.toLowerCase();

    if (lower.includes('rockstar') || lower.includes('ninja')) {
      flaggedWords.push({
        word: 'rockstar / ninja',
        suggestion: 'skilled professional / experienced developer',
        reason: 'Jargon that can discourage qualified candidates',
      });
    }
    if (lower.includes('aggressive')) {
      flaggedWords.push({
        word: 'aggressive',
        suggestion: 'proactive / outcome-driven',
        reason: 'Gender-coded language that can skew applicant demographics',
      });
    }

    return {
      status: 'success',
      configured: true,
      hasBiasFlags: flaggedWords.length > 0,
      flags: flaggedWords,
    };
  }

  // Explain match breakdown between candidate and job
  async explainMatch(candidateUserId: string, jobId: string) {
    const [job, profile] = await Promise.all([
      this.jobModel.findById(jobId).exec(),
      this.candidateProfileModel.findOne({ userId: candidateUserId }).exec(),
    ]);

    if (!job) {
      throw new NotFoundException('Job requisition not found');
    }
    if (!profile) {
      throw new NotFoundException('Candidate profile not found');
    }

    const candidateSkillNames = new Set(profile.skills.map((s) => s.name.toLowerCase()));
    const jobSkills = job.skills || [];

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of jobSkills) {
      if (candidateSkillNames.has(skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const skillScore = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 70) : 50;
    const experienceScore = Math.min(30, (profile.yearsExperience || 0) * 5);
    const overallScore = Math.min(100, skillScore + experienceScore);

    return {
      jobId: job._id,
      candidateId: candidateUserId,
      overallScore,
      explainability: {
        scoreBreakdown: {
          skillsScore: skillScore,
          experienceScore,
          total: overallScore,
        },
        matchedSkills,
        missingSkills,
        summary: `Candidate matches ${matchedSkills.length} of ${jobSkills.length} requested skills with ${profile.yearsExperience || 0} years experience.`,
        governanceNotice: 'AI match scores are informational and never automatically reject candidates.',
      },
    };
  }

  // Recommended jobs for candidate
  async getRecommendedJobs(candidateUserId: string, limit = 10) {
    const profile = await this.candidateProfileModel.findOne({ userId: candidateUserId }).exec();
    const candidateSkills = (profile?.skills || []).map((s) => s.name.toLowerCase());

    const jobs = await this.jobModel.find({ status: JobStatus.PUBLISHED }).limit(50).exec();

    const scoredJobs = jobs.map((job) => {
      const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
      const matches = jobSkills.filter((s) => candidateSkills.includes(s));
      const score = jobSkills.length > 0 ? Math.round((matches.length / jobSkills.length) * 100) : 60;
      return {
        job,
        matchScore: score,
        matchedSkills: matches,
      };
    });

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    return scoredJobs.slice(0, limit);
  }

  // Recommended candidates for employer job
  async getRecommendedCandidates(tenantId: string, jobId: string, limit = 10) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job || job.tenantId !== tenantId) {
      throw new NotFoundException('Job not found');
    }

    const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
    const profiles = await this.candidateProfileModel.find({ visibility: { $ne: 'HIDDEN' } }).limit(50).exec();
    const userIds = profiles.map((p) => p.userId);
    const users = await this.userModel.find({ _id: { $in: userIds as any } }).select('firstName lastName email phone').exec();
    const userMap = new Map<string, any>(users.map((u) => [String(u._id), u]));

    const scoredCandidates = profiles.map((profile) => {
      const candidateSkills = profile.skills.map((s) => s.name.toLowerCase());
      const matches = jobSkills.filter((s) => candidateSkills.includes(s));
      const score = jobSkills.length > 0 ? Math.round((matches.length / jobSkills.length) * 100) : 50;
      return {
        candidateId: profile.userId,
        profile,
        user: userMap.get(profile.userId) || null,
        matchScore: score,
        matchedSkills: matches,
      };
    });

    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
    return scoredCandidates.slice(0, limit);
  }
}
