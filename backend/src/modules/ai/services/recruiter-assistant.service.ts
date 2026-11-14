import { Injectable, Logger } from '@nestjs/common';
import { LlmClientService } from './llm-client.service';
import {
  JobDescriptionDraftResult,
  BiasCheckResult,
  InterviewQuestionsResult,
  CandidateRecruiterSummaryResult,
} from '../interfaces/ai.interfaces';
import { GenerateJobDescriptionDto, BiasCheckDto } from '../dto/ai.dto';

@Injectable()
export class RecruiterAssistantService {
  private readonly logger = new Logger(RecruiterAssistantService.name);

  constructor(private readonly llmClient: LlmClientService) {}

  async generateJobDescription(dto: GenerateJobDescriptionDto): Promise<JobDescriptionDraftResult> {
    const isConfigured = this.llmClient.isConfigured();

    if (!isConfigured) {
      return {
        title: dto.title,
        description: `We are looking for a high-performing ${dto.title}${dto.industry ? ` in the ${dto.industry} industry` : ''} to join our engineering division. In this position, you will design, build, and support scalable software systems and collaborate across cross-functional teams.`,
        suggestedSkills: dto.keySkills ? dto.keySkills.split(',').map((s) => s.trim()) : ['TypeScript', 'Cloud Infrastructure', 'Problem Solving'],
        responsibilities: [
          'Architect and deliver resilient, high-quality distributed services.',
          'Collaborate with product managers and engineers to define technical scope.',
          'Participate in design and code reviews to uphold engineering standards.',
        ],
        qualifications: [
          `${dto.level || '3+'} years of experience developing software solutions.`,
          'Proficiency with modern full-stack web and cloud technologies.',
          'Strong communication skills and collaborative team mindset.',
        ],
        draftNotice: 'AI-GENERATED DRAFT: Requires human recruiter review and editing before publication.',
      };
    }

    const systemPrompt = `You are an expert HR recruiting specialist.
Create an inclusive, high-clarity job description draft based on provided requisition details.
Avoid exclusionary language or jargon like 'ninja', 'rockstar', or aggressive descriptors.
Return ONLY valid JSON matching this schema:
{
  "title": string,
  "description": string,
  "suggestedSkills": string[],
  "responsibilities": string[],
  "qualifications": string[]
}`;

    const userPrompt = `Requisition Title: ${dto.title}
Level: ${dto.level || 'Mid-Senior'}
Industry: ${dto.industry || 'Technology'}
Key Skills: ${dto.keySkills || 'General engineering competencies'}`;

    try {
      const response = await this.llmClient.generateChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { responseFormat: 'json', temperature: 0.3 },
      );

      const parsed = JSON.parse(response);
      return {
        title: parsed.title || dto.title,
        description: parsed.description || '',
        suggestedSkills: Array.isArray(parsed.suggestedSkills) ? parsed.suggestedSkills : [],
        responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : [],
        qualifications: Array.isArray(parsed.qualifications) ? parsed.qualifications : [],
        draftNotice: 'AI-GENERATED DRAFT: Requires human recruiter review and editing before publication.',
      };
    } catch (err: any) {
      this.logger.warn(`AI job description generation failed: ${err.message}. Providing fallback template.`);
      return {
        title: dto.title,
        description: `We are seeking a talented ${dto.title} to deliver mission-critical software capabilities.`,
        suggestedSkills: dto.keySkills ? dto.keySkills.split(',').map((s) => s.trim()) : ['TypeScript', 'Distributed Systems'],
        responsibilities: ['Develop clean and maintainable code.', 'Collaborate with agile teammates.'],
        qualifications: ['Demonstrated experience in modern software development.'],
        draftNotice: 'AI-GENERATED DRAFT: Requires human recruiter review and editing before publication.',
      };
    }
  }

  async checkBias(dto: BiasCheckDto): Promise<BiasCheckResult> {
    const isConfigured = this.llmClient.isConfigured();
    const textLower = dto.text.toLowerCase();

    const heuristicFlags: Array<{ word: string; suggestion: string; reason: string }> = [];

    const knownBiasedTerms = [
      {
        word: 'rockstar',
        suggestion: 'skilled professional / experienced specialist',
        reason: 'Informal hype words may discourage underrepresented demographics from applying.',
      },
      {
        word: 'ninja',
        suggestion: 'adept engineer / proficient developer',
        reason: 'Cultural jargon that can obscure real job requirements.',
      },
      {
        word: 'aggressive',
        suggestion: 'proactive / outcome-driven / goal-oriented',
        reason: 'Hyper-competitive phrasing that statistically skews applicant pools.',
      },
      {
        word: 'guru',
        suggestion: 'subject matter expert / technical lead',
        reason: 'Informal buzzword that lacks concrete qualification criteria.',
      },
      {
        word: 'native english speaker',
        suggestion: 'strong written and verbal English communication skills',
        reason: 'May unlawfully discriminate against fluent non-native speakers.',
      },
    ];

    for (const term of knownBiasedTerms) {
      if (textLower.includes(term.word)) {
        heuristicFlags.push({
          word: term.word,
          suggestion: term.suggestion,
          reason: term.reason,
        });
      }
    }

    if (!isConfigured) {
      return {
        hasBiasFlags: heuristicFlags.length > 0,
        flags: heuristicFlags,
        inclusiveScore: Math.max(40, 100 - heuristicFlags.length * 20),
      };
    }

    const systemPrompt = `You are a diversity, equity, and inclusion (DEI) HR specialist.
Review job posting text for exclusionary, biased, gender-coded, or hyper-aggressive wording.
Provide actionable suggestions to make language inclusive and welcoming.
Return ONLY valid JSON matching this schema:
{
  "hasBiasFlags": boolean,
  "flags": [
    {
      "word": string,
      "suggestion": string,
      "reason": string
    }
  ],
  "inclusiveScore": number
}`;

    try {
      const response = await this.llmClient.generateChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this job posting text:\n\n${dto.text}` },
        ],
        { responseFormat: 'json', temperature: 0.1 },
      );

      const parsed = JSON.parse(response);
      return {
        hasBiasFlags: Boolean(parsed.hasBiasFlags || heuristicFlags.length > 0),
        flags: Array.isArray(parsed.flags) && parsed.flags.length > 0 ? parsed.flags : heuristicFlags,
        inclusiveScore: typeof parsed.inclusiveScore === 'number' ? parsed.inclusiveScore : Math.max(50, 100 - heuristicFlags.length * 20),
      };
    } catch {
      return {
        hasBiasFlags: heuristicFlags.length > 0,
        flags: heuristicFlags,
        inclusiveScore: Math.max(40, 100 - heuristicFlags.length * 20),
      };
    }
  }

  async generateInterviewQuestions(jobTitle: string, skills: string[]): Promise<InterviewQuestionsResult> {
    const isConfigured = this.llmClient.isConfigured();

    if (!isConfigured) {
      return {
        jobTitle,
        questions: [
          {
            category: 'technical',
            question: `How have you applied ${skills[0] || 'core technologies'} to resolve a complex production incident?`,
            targetCompetency: 'Technical Problem Solving',
            expectedIndicators: ['Root-cause analysis', 'System metrics inspection', 'Post-mortem actions'],
          },
          {
            category: 'behavioral',
            question: 'Describe a situation where you had a disagreement with a team member over an architectural decision.',
            targetCompetency: 'Collaboration & Communication',
            expectedIndicators: ['Objective data usage', 'Respectful negotiation', 'Commitment to team velocity'],
          },
          {
            category: 'role_specific',
            question: `What considerations do you prioritize when architecting systems for ${jobTitle} responsibilities?`,
            targetCompetency: 'Domain Architecture',
            expectedIndicators: ['Scalability', 'Fault tolerance', 'Observability'],
          },
        ],
      };
    }

    const systemPrompt = `You are a technical hiring manager.
Suggest structured, unbiased interview questions based on job title and required skills.
Return ONLY valid JSON matching this schema:
{
  "jobTitle": string,
  "questions": [
    {
      "category": "technical" | "behavioral" | "role_specific",
      "question": string,
      "targetCompetency": string,
      "expectedIndicators": string[]
    }
  ]
}`;

    try {
      const response = await this.llmClient.generateChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Job Title: ${jobTitle}\nSkills: ${skills.join(', ')}` },
        ],
        { responseFormat: 'json', temperature: 0.2 },
      );

      const parsed = JSON.parse(response);
      return {
        jobTitle,
        questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      };
    } catch {
      return this.generateInterviewQuestions(jobTitle, skills);
    }
  }

  async generateCandidateRecruiterSummary(
    candidateId: string,
    candidateName: string,
    skills: string[],
    yearsExperience: number,
    recentRole?: string,
  ): Promise<CandidateRecruiterSummaryResult> {
    const isConfigured = this.llmClient.isConfigured();

    if (!isConfigured) {
      return {
        candidateId,
        executiveSummary: `${candidateName || 'Candidate'} is an experienced professional with ${yearsExperience} years in the field${recentRole ? ` having recently served as ${recentRole}` : ''}. Core competencies span ${skills.slice(0, 5).join(', ')}.`,
        keyStrengths: skills.slice(0, 4).map((s) => `Demonstrated hands-on experience in ${s}`),
        growthAreas: ['Expand system leadership into cross-organizational initiatives.'],
        recommendedRoles: [recentRole || 'Senior Engineer', 'Lead Developer'],
        draftNotice: 'AI-GENERATED DRAFT: Designed strictly to assist recruiter evaluation. Requires human verification.',
      };
    }

    const systemPrompt = `You are an executive talent acquisition director.
Synthesize candidate profile details into an objective, recruiter-ready briefing.
Never include assumptions about protected demographic characteristics.
Return ONLY valid JSON matching this schema:
{
  "executiveSummary": string,
  "keyStrengths": string[],
  "growthAreas": string[],
  "recommendedRoles": string[]
}`;

    const userPrompt = `Candidate: ${candidateName}
Years Experience: ${yearsExperience}
Recent Role: ${recentRole || 'Software Professional'}
Skills: ${skills.join(', ')}`;

    try {
      const response = await this.llmClient.generateChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { responseFormat: 'json', temperature: 0.2 },
      );

      const parsed = JSON.parse(response);
      return {
        candidateId,
        executiveSummary: parsed.executiveSummary || '',
        keyStrengths: Array.isArray(parsed.keyStrengths) ? parsed.keyStrengths : [],
        growthAreas: Array.isArray(parsed.growthAreas) ? parsed.growthAreas : [],
        recommendedRoles: Array.isArray(parsed.recommendedRoles) ? parsed.recommendedRoles : [],
        draftNotice: 'AI-GENERATED DRAFT: Designed strictly to assist recruiter evaluation. Requires human verification.',
      };
    } catch {
      return this.generateCandidateRecruiterSummary(candidateId, candidateName, skills, yearsExperience, recentRole);
    }
  }
}
