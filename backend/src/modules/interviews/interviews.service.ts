import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Interview, InterviewDocument } from '../../database/schemas/interview.schema';
import { Scorecard, ScorecardDocument } from '../../database/schemas/scorecard.schema';
import { Application, ApplicationDocument } from '../../database/schemas/application.schema';
import { Assessment, AssessmentDocument } from '../../database/schemas/assessment.schema';
import { AssessmentAttempt, AssessmentAttemptDocument } from '../../database/schemas/assessment-attempt.schema';
import { Notification, NotificationDocument } from '../../database/schemas/notification.schema';
import { InterviewStatus, AssessmentStatus } from '../../common/constants/roles.enum';
import {
  CreateInterviewDto,
  SubmitScorecardDto,
  CreateAssessmentDto,
  InviteAssessmentDto,
  SaveAnswerDto,
} from './dto/interview.dto';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview.name) private readonly interviewModel: Model<InterviewDocument>,
    @InjectModel(Scorecard.name) private readonly scorecardModel: Model<ScorecardDocument>,
    @InjectModel(Application.name) private readonly applicationModel: Model<ApplicationDocument>,
    @InjectModel(Assessment.name) private readonly assessmentModel: Model<AssessmentDocument>,
    @InjectModel(AssessmentAttempt.name)
    private readonly attemptModel: Model<AssessmentAttemptDocument>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  // Employer: Create interview
  async createInterview(tenantId: string, dto: CreateInterviewDto) {
    const app = await this.applicationModel.findById(dto.applicationId).exec();
    if (!app || app.tenantId !== tenantId) {
      throw new NotFoundException('Application not found');
    }

    const interviewId = uuidv4();
    const interview = await this.interviewModel.create({
      _id: interviewId,
      tenantId,
      applicationId: dto.applicationId,
      jobId: app.jobId,
      candidateId: app.candidateId,
      interviewerIds: dto.interviewerIds,
      type: dto.type || 'VIDEO',
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      timezone: dto.timezone || 'UTC',
      status: InterviewStatus.SCHEDULED,
      notes: dto.notes,
    });

    // Notify candidate
    await this.notificationModel.create({
      _id: uuidv4(),
      userId: app.candidateId,
      tenantId,
      type: 'INTERVIEW_SCHEDULED',
      title: 'Interview Scheduled',
      message: `You have an interview scheduled for ${dto.startsAt}.`,
      data: { interviewId, startsAt: dto.startsAt },
    });

    return interview;
  }

  // Employer: List tenant interviews
  async getTenantInterviews(tenantId: string) {
    return this.interviewModel.find({ tenantId }).sort({ startsAt: -1 }).exec();
  }

  // Candidate: Get own scheduled interviews
  async getCandidateInterviews(candidateId: string) {
    return this.interviewModel.find({ candidateId }).sort({ startsAt: -1 }).exec();
  }

  // Employer: Cancel interview
  async cancelInterview(tenantId: string, interviewId: string) {
    const interview = await this.interviewModel.findOne({ _id: interviewId, tenantId }).exec();
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    interview.status = InterviewStatus.CANCELLED;
    await interview.save();

    await this.notificationModel.create({
      _id: uuidv4(),
      userId: interview.candidateId,
      tenantId,
      type: 'INTERVIEW_CANCELLED',
      title: 'Interview Cancelled',
      message: 'Your upcoming interview has been cancelled.',
      data: { interviewId },
    });

    return { success: true, message: 'Interview cancelled' };
  }

  // Interviewer: Submit scorecard
  async submitScorecard(tenantId: string, interviewId: string, interviewerId: string, dto: SubmitScorecardDto) {
    const interview = await this.interviewModel.findOne({ _id: interviewId, tenantId }).exec();
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    const existing = await this.scorecardModel.findOne({ interviewId, interviewerId }).exec();
    if (existing) {
      existing.ratings = dto.ratings as any;
      existing.overallRating = dto.overallRating;
      existing.recommendation = dto.recommendation;
      existing.summary = dto.summary;
      return existing.save();
    }

    return this.scorecardModel.create({
      _id: uuidv4(),
      interviewId,
      applicationId: interview.applicationId,
      tenantId,
      interviewerId,
      ratings: dto.ratings,
      overallRating: dto.overallRating,
      recommendation: dto.recommendation,
      summary: dto.summary,
      submittedAt: new Date(),
    });
  }

  // Employer: Get aggregated scorecards for application
  async getApplicationScorecards(tenantId: string, applicationId: string) {
    const app = await this.applicationModel.findById(applicationId).exec();
    if (!app || app.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }
    return this.scorecardModel.find({ applicationId, tenantId }).sort({ submittedAt: -1 }).exec();
  }

  // Assessments
  async createAssessment(tenantId: string, dto: CreateAssessmentDto) {
    return this.assessmentModel.create({
      _id: uuidv4(),
      tenantId,
      title: dto.title,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
      passScore: dto.passScore,
      questions: dto.questions,
    });
  }

  async getTenantAssessments(tenantId: string) {
    return this.assessmentModel.find({ tenantId }).sort({ createdAt: -1 }).exec();
  }

  async inviteToAssessment(tenantId: string, assessmentId: string, dto: InviteAssessmentDto) {
    const [assessment, app] = await Promise.all([
      this.assessmentModel.findOne({ _id: assessmentId, tenantId }).exec(),
      this.applicationModel.findOne({ _id: dto.applicationId, tenantId }).exec(),
    ]);

    if (!assessment || !app) {
      throw new NotFoundException('Assessment or application not found');
    }

    const inviteId = uuidv4();
    const attempt = await this.attemptModel.create({
      _id: uuidv4(),
      assessmentId,
      tenantId,
      applicationId: app._id,
      candidateId: app.candidateId,
      inviteId,
      status: AssessmentStatus.INVITED,
      integrityScore: 100,
      answers: {},
      proctorEvents: [],
    });

    await this.notificationModel.create({
      _id: uuidv4(),
      userId: app.candidateId,
      tenantId,
      type: 'ASSESSMENT_INVITATION',
      title: 'Skills Assessment Invitation',
      message: `You have been invited to complete the "${assessment.title}" assessment.`,
      data: { inviteId, assessmentId },
    });

    return attempt;
  }

  async getCandidatePendingAssessments(candidateId: string) {
    return this.attemptModel.find({ candidateId }).sort({ createdAt: -1 }).exec();
  }

  async startAttempt(candidateId: string, inviteId: string) {
    const attempt = await this.attemptModel.findOne({ inviteId, candidateId }).exec();
    if (!attempt) {
      throw new NotFoundException('Assessment invitation not found');
    }

    const assessment = await this.assessmentModel.findById(attempt.assessmentId).exec();
    if (!assessment) {
      throw new NotFoundException('Assessment template not found');
    }

    if (!attempt.startedAt) {
      attempt.startedAt = new Date();
      const deadline = new Date();
      deadline.setMinutes(deadline.getMinutes() + assessment.durationMinutes);
      attempt.deadlineAt = deadline;
      attempt.status = AssessmentStatus.IN_PROGRESS;
      await attempt.save();
    }

    return {
      attemptId: attempt._id,
      status: attempt.status,
      startedAt: attempt.startedAt,
      deadlineAt: attempt.deadlineAt,
      title: assessment.title,
      durationMinutes: assessment.durationMinutes,
      questions: assessment.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        options: q.options,
        points: q.points,
      })),
    };
  }

  async saveAttemptAnswer(candidateId: string, attemptId: string, questionId: string, dto: SaveAnswerDto) {
    const attempt = await this.attemptModel.findOne({ _id: attemptId, candidateId }).exec();
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.deadlineAt && new Date() > attempt.deadlineAt) {
      throw new BadRequestException('Assessment deadline has expired');
    }

    attempt.answers = { ...attempt.answers, [questionId]: dto.answer };
    await attempt.save();
    return { success: true };
  }

  async submitAttempt(candidateId: string, attemptId: string) {
    const attempt = await this.attemptModel.findOne({ _id: attemptId, candidateId }).exec();
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const assessment = await this.assessmentModel.findById(attempt.assessmentId).exec();
    let totalPoints = 0;
    let earnedPoints = 0;

    if (assessment?.questions?.length) {
      for (const q of assessment.questions) {
        totalPoints += q.points || 10;
        if (q.correctAnswer && attempt.answers?.[q.id] === q.correctAnswer) {
          earnedPoints += q.points || 10;
        }
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 80;

    attempt.score = score;
    attempt.status = AssessmentStatus.GRADED;
    attempt.submittedAt = new Date();
    await attempt.save();

    return {
      success: true,
      message: 'Assessment submitted successfully',
      score,
      status: attempt.status,
    };
  }

  async getAssessmentResults(tenantId: string, assessmentId: string) {
    return this.attemptModel.find({ assessmentId, tenantId }).sort({ submittedAt: -1 }).exec();
  }
}
