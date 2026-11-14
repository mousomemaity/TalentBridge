import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../../database/schemas/job.schema';
import { CandidateProfile, CandidateProfileDocument } from '../../database/schemas/candidate-profile.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Resume, ResumeDocument } from '../../database/schemas/resume.schema';
import {
  GenerateJobDescriptionDto,
  BiasCheckDto,
  AnalyzeResumeDto,
  GenerateInterviewQuestionsDto,
} from './dto/ai.dto';
import { JobStatus } from '../../common/constants/roles.enum';
import { LlmClientService } from './services/llm-client.service';
import { DocumentExtractorService } from './services/document-extractor.service';
import { ResumeParserService } from './services/resume-parser.service';
import { ResumeAnalyzerService } from './services/resume-analyzer.service';
import { JobMatcherService } from './services/job-matcher.service';
import { RecruiterAssistantService } from './services/recruiter-assistant.service';
import { ParsedResumeData } from './interfaces/ai.interfaces';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(CandidateProfile.name)
    private readonly candidateProfileModel: Model<CandidateProfileDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    private readonly llmClient: LlmClientService,
    private readonly documentExtractor: DocumentExtractorService,
    private readonly resumeParser: ResumeParserService,
    private readonly resumeAnalyzer: ResumeAnalyzerService,
    private readonly jobMatcher: JobMatcherService,
    private readonly recruiterAssistant: RecruiterAssistantService,
  ) {}

  isAiConfigured(): boolean {
    return this.llmClient.isConfigured();
  }

  // Feature 1: Resume Parsing from buffer or text
  async parseResumeFile(
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<ParsedResumeData> {
    const extracted = await this.documentExtractor.extractText(fileBuffer, mimeType);
    return this.resumeParser.parseResumeText(extracted.text);
  }

  async parseResumeText(rawText: string): Promise<ParsedResumeData> {
    return this.resumeParser.parseResumeText(rawText);
  }

  // Feature 2: AI Resume Analysis
  async analyzeResume(candidateUserId: string, dto?: AnalyzeResumeDto) {
    const profile = await this.candidateProfileModel.findOne({ userId: candidateUserId }).exec();
    if (!profile) {
      throw new NotFoundException('Candidate profile not found');
    }

    const skills = (profile.skills || []).map((s) => s.name);
    const summary = profile.summary || profile.headline;
    const experiences = profile.experiences || [];

    const analysis = await this.resumeAnalyzer.analyzeResume(
      skills,
      summary,
      experiences,
      dto?.targetRole,
    );

    return {
      status: 'success',
      configured: this.isAiConfigured(),
      data: analysis,
    };
  }

  // Feature 3: Recommended jobs for candidate with transparent scoring
  async getRecommendedJobs(candidateUserId: string, limit = 10) {
    const profile = await this.candidateProfileModel.findOne({ userId: candidateUserId }).exec();
    const candidateInput = {
      userId: candidateUserId,
      skills: (profile?.skills || []).map((s) => ({
        name: s.name,
        level: s.level,
        yearsExperience: s.yearsExperience,
      })),
      yearsExperience: profile?.yearsExperience || 0,
      location: profile?.location,
      remoteOnly: profile?.preferences?.remoteOnly,
      targetSalaryMin: profile?.preferences?.salaryMin,
    };

    const jobs = await this.jobModel.find({ status: JobStatus.PUBLISHED }).limit(50).exec();

    const scoredJobs = jobs.map((job) => {
      const jobInput = {
        jobId: job._id,
        title: job.title,
        skills: job.skills || [],
        workplaceType: job.workplaceType,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        requirements: job.requirements,
      };

      const match = this.jobMatcher.computeMatch(candidateInput, jobInput);
      return {
        job,
        matchScore: match.overallScore,
        matchedSkills: match.explainability.matchedSkills,
        missingSkills: match.explainability.missingSkills,
        scoreBreakdown: match.explainability.scoreBreakdown,
        explanation: match.explainability.summary,
      };
    });

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    return scoredJobs.slice(0, limit);
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

    const candidateInput = {
      userId: candidateUserId,
      skills: (profile.skills || []).map((s) => ({
        name: s.name,
        level: s.level,
        yearsExperience: s.yearsExperience,
      })),
      yearsExperience: profile.yearsExperience || 0,
      location: profile.location,
      remoteOnly: profile.preferences?.remoteOnly,
      targetSalaryMin: profile.preferences?.salaryMin,
    };

    const jobInput = {
      jobId: job._id,
      title: job.title,
      skills: job.skills || [],
      workplaceType: job.workplaceType,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      requirements: job.requirements,
    };

    return this.jobMatcher.computeMatch(candidateInput, jobInput);
  }

  // Recommended candidates for employer job
  async getRecommendedCandidates(tenantId: string, jobId: string, limit = 10) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job || job.tenantId !== tenantId) {
      throw new NotFoundException('Job not found');
    }

    const profiles = await this.candidateProfileModel.find({ visibility: { $ne: 'HIDDEN' } }).limit(50).exec();
    const userIds = profiles.map((p) => p.userId);
    const users = await this.userModel.find({ _id: { $in: userIds as any } }).select('firstName lastName email phone').exec();
    const userMap = new Map<string, any>(users.map((u) => [String(u._id), u]));

    const jobInput = {
      jobId: job._id,
      title: job.title,
      skills: job.skills || [],
      workplaceType: job.workplaceType,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      requirements: job.requirements,
    };

    const scoredCandidates = profiles.map((profile) => {
      const candidateInput = {
        userId: profile.userId,
        skills: (profile.skills || []).map((s) => ({
          name: s.name,
          level: s.level,
          yearsExperience: s.yearsExperience,
        })),
        yearsExperience: profile.yearsExperience || 0,
        location: profile.location,
        remoteOnly: profile.preferences?.remoteOnly,
        targetSalaryMin: profile.preferences?.salaryMin,
      };

      const match = this.jobMatcher.computeMatch(candidateInput, jobInput);

      return {
        candidateId: profile.userId,
        profile,
        user: userMap.get(profile.userId) || null,
        matchScore: match.overallScore,
        matchedSkills: match.explainability.matchedSkills,
        missingSkills: match.explainability.missingSkills,
        scoreBreakdown: match.explainability.scoreBreakdown,
        explanation: match.explainability.summary,
      };
    });

    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
    return scoredCandidates.slice(0, limit);
  }

  // Feature 4: Recruiter assistance
  async generateJobDescription(dto: GenerateJobDescriptionDto) {
    const draft = await this.recruiterAssistant.generateJobDescription(dto);
    return {
      status: 'success',
      configured: this.isAiConfigured(),
      data: draft,
    };
  }

  async checkBias(dto: BiasCheckDto) {
    const result = await this.recruiterAssistant.checkBias(dto);
    return {
      status: 'success',
      configured: this.isAiConfigured(),
      hasBiasFlags: result.hasBiasFlags,
      flags: result.flags,
      inclusiveScore: result.inclusiveScore,
    };
  }

  async generateInterviewQuestions(dto: GenerateInterviewQuestionsDto) {
    const result = await this.recruiterAssistant.generateInterviewQuestions(dto.jobTitle, dto.skills || []);
    return {
      status: 'success',
      configured: this.isAiConfigured(),
      data: result,
    };
  }

  async generateCandidateRecruiterSummary(candidateUserId: string) {
    const [profile, user] = await Promise.all([
      this.candidateProfileModel.findOne({ userId: candidateUserId }).exec(),
      this.userModel.findById(candidateUserId).exec(),
    ]);

    if (!profile) {
      throw new NotFoundException('Candidate profile not found');
    }

    const candidateName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Candidate';
    const skills = (profile.skills || []).map((s) => s.name);
    const recentRole = profile.headline || (profile.experiences?.[0]?.title);

    const summary = await this.recruiterAssistant.generateCandidateRecruiterSummary(
      candidateUserId,
      candidateName,
      skills,
      profile.yearsExperience || 0,
      recentRole,
    );

    return {
      status: 'success',
      configured: this.isAiConfigured(),
      data: summary,
    };
  }
}
