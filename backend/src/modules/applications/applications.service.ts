import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Application, ApplicationDocument } from '../../database/schemas/application.schema';
import { ApplicationStageHistory, ApplicationStageHistoryDocument } from '../../database/schemas/application-stage-history.schema';
import { Job, JobDocument } from '../../database/schemas/job.schema';
import { JobStage, JobStageDocument } from '../../database/schemas/job-stage.schema';
import { TenantCandidate, TenantCandidateDocument } from '../../database/schemas/tenant-candidate.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Resume, ResumeDocument } from '../../database/schemas/resume.schema';
import { Notification, NotificationDocument } from '../../database/schemas/notification.schema';
import { JobStatus, ApplicationStatus, StageKind, UserRole } from '../../common/constants/roles.enum';
import { ApplyJobDto, MoveStageDto, RejectApplicationDto, AddApplicationNoteDto, BulkMoveDto, BulkRejectDto } from './dto/apply-job.dto';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private readonly applicationModel: Model<ApplicationDocument>,
    @InjectModel(ApplicationStageHistory.name)
    private readonly stageHistoryModel: Model<ApplicationStageHistoryDocument>,
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(JobStage.name) private readonly jobStageModel: Model<JobStageDocument>,
    @InjectModel(TenantCandidate.name)
    private readonly tenantCandidateModel: Model<TenantCandidateDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  // Candidate: Apply for a job
  async applyForJob(jobId: string, user: AuthenticatedUser, dto: ApplyJobDto) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== JobStatus.PUBLISHED) {
      throw new BadRequestException('This job is not currently accepting applications');
    }

    // Check uniqueness before create
    const existing = await this.applicationModel.findOne({ jobId, candidateId: user.userId }).exec();
    if (existing) {
      throw new ConflictException('You have already submitted an application for this position');
    }

    // Find initial stage (Applied)
    const initialStage = await this.jobStageModel.findOne({ jobId, kind: StageKind.APPLIED }).exec()
      || await this.jobStageModel.findOne({ jobId }).sort({ position: 1 }).exec();

    if (!initialStage) {
      throw new BadRequestException('Hiring pipeline is not configured for this job');
    }

    // Get or create TenantCandidate record
    const candidateUser = await this.userModel.findById(user.userId).exec();
    let tenantCandidate = await this.tenantCandidateModel.findOne({
      tenantId: job.tenantId,
      email: candidateUser?.email || user.email,
    }).exec();

    if (!tenantCandidate) {
      tenantCandidate = await this.tenantCandidateModel.create({
        _id: uuidv4(),
        tenantId: job.tenantId,
        userId: user.userId,
        email: candidateUser?.email || user.email,
        name: candidateUser ? `${candidateUser.firstName} ${candidateUser.lastName}` : undefined,
        source: 'DIRECT_APPLICATION',
      });
    }

    const applicationId = uuidv4();
    try {
      const application = await this.applicationModel.create({
        _id: applicationId,
        tenantId: job.tenantId,
        jobId,
        candidateId: user.userId,
        tenantCandidateId: tenantCandidate._id,
        resumeId: dto.resumeId,
        stageId: initialStage._id,
        status: ApplicationStatus.ACTIVE,
        version: 1,
        coverLetter: dto.coverLetter,
        screeningAnswers: dto.screeningAnswers || {},
        rating: 0,
        tags: [],
        appliedAt: new Date(),
      });

      // Record stage history
      await this.stageHistoryModel.create({
        _id: uuidv4(),
        applicationId,
        tenantId: job.tenantId,
        fromStageId: initialStage._id,
        toStageId: initialStage._id,
        fromStatus: ApplicationStatus.ACTIVE,
        toStatus: ApplicationStatus.ACTIVE,
        actorId: user.userId,
        actorRole: user.role,
        reason: 'Initial application submitted',
        movedAt: new Date(),
      });

      // Send confirmation notification to candidate
      await this.notificationModel.create({
        _id: uuidv4(),
        userId: user.userId,
        tenantId: job.tenantId,
        type: 'APPLICATION_SUBMITTED',
        title: 'Application Received',
        message: `Your application for "${job.title}" has been successfully submitted.`,
        data: { applicationId, jobId },
      });

      return application;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('You have already submitted an application for this position');
      }
      throw err;
    }
  }

  // Candidate: Get own applications
  async getCandidateApplications(candidateId: string) {
    const applications = await this.applicationModel.find({ candidateId }).sort({ appliedAt: -1 }).exec();
    const jobIds = applications.map((a) => a.jobId);
    const stageIds = applications.map((a) => a.stageId);

    const [jobs, stages] = await Promise.all([
      this.jobModel.find({ _id: { $in: jobIds as any } }).select('title slug department location workplaceType status').exec(),
      this.jobStageModel.find({ _id: { $in: stageIds as any } }).select('name kind').exec(),
    ]);

    const jobMap = new Map<string, any>(jobs.map((j) => [String(j._id), j]));
    const stageMap = new Map<string, any>(stages.map((s) => [String(s._id), s]));

    return applications.map((app) => ({
      ...app.toObject(),
      job: jobMap.get(app.jobId) || null,
      stage: stageMap.get(app.stageId) || null,
    }));
  }

  // Candidate: Get application detail and timeline
  async getCandidateApplicationById(candidateId: string, applicationId: string) {
    const application = await this.applicationModel.findById(applicationId).exec();
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    if (application.candidateId !== candidateId) {
      throw new ForbiddenException('Access denied: You can only view your own applications');
    }

    const [job, stage, history] = await Promise.all([
      this.jobModel.findById(application.jobId).select('title slug department location salaryMin salaryMax currency').exec(),
      this.jobStageModel.findById(application.stageId).select('name kind').exec(),
      this.stageHistoryModel.find({ applicationId }).sort({ movedAt: -1 }).exec(),
    ]);

    return {
      ...application.toObject(),
      job,
      stage,
      timeline: history,
    };
  }

  // Candidate: Withdraw application
  async withdrawApplication(candidateId: string, applicationId: string) {
    const application = await this.applicationModel.findById(applicationId).exec();
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    if (application.candidateId !== candidateId) {
      throw new ForbiddenException('Access denied');
    }

    application.status = ApplicationStatus.WITHDRAWN;
    await application.save();

    await this.stageHistoryModel.create({
      _id: uuidv4(),
      applicationId,
      tenantId: application.tenantId,
      fromStageId: application.stageId,
      toStageId: application.stageId,
      fromStatus: ApplicationStatus.ACTIVE,
      toStatus: ApplicationStatus.WITHDRAWN,
      actorId: candidateId,
      actorRole: UserRole.CANDIDATE,
      reason: 'Candidate withdrew application',
      movedAt: new Date(),
    });

    return { success: true, message: 'Application withdrawn successfully' };
  }

  // Employer ATS: List applications for a job grouped by stage
  async getJobApplicationsGroupedByStage(tenantId: string, jobId: string) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job || job.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied to this job');
    }

    const [stages, applications] = await Promise.all([
      this.jobStageModel.find({ jobId }).sort({ position: 1 }).exec(),
      this.applicationModel.find({ jobId, tenantId }).sort({ appliedAt: -1 }).exec(),
    ]);

    const candidateIds = applications.map((a) => a.candidateId);
    const users = await this.userModel.find({ _id: { $in: candidateIds as any } }).select('firstName lastName email phone').exec();
    const userMap = new Map<string, any>(users.map((u) => [String(u._id), u]));

    const grouped: Record<string, { stage: JobStageDocument; count: number; applications: any[] }> = {};
    for (const stage of stages) {
      grouped[stage._id] = {
        stage,
        count: 0,
        applications: [],
      };
    }

    for (const app of applications) {
      if (grouped[app.stageId]) {
        grouped[app.stageId].count++;
        grouped[app.stageId].applications.push({
          ...app.toObject(),
          candidate: userMap.get(app.candidateId) || null,
        });
      }
    }

    return Object.values(grouped);
  }

  // Employer ATS: Application 360
  async getApplication360(tenantId: string, applicationId: string) {
    const application = await this.applicationModel.findById(applicationId).exec();
    if (!application || application.tenantId !== tenantId) {
      throw new NotFoundException('Application not found');
    }

    const [candidateUser, resume, job, stage, history] = await Promise.all([
      this.userModel.findById(application.candidateId).select('firstName lastName email phone').exec(),
      application.resumeId ? this.resumeModel.findById(application.resumeId).exec() : null,
      this.jobModel.findById(application.jobId).exec(),
      this.jobStageModel.findById(application.stageId).exec(),
      this.stageHistoryModel.find({ applicationId }).sort({ movedAt: -1 }).exec(),
    ]);

    return {
      ...application.toObject(),
      candidate: candidateUser,
      resume,
      job,
      stage,
      activityTimeline: history,
    };
  }

  // Employer ATS: Move stage with optimistic version check
  async moveStage(tenantId: string, applicationId: string, user: AuthenticatedUser, dto: MoveStageDto) {
    const application = await this.applicationModel.findById(applicationId).exec();
    if (!application || application.tenantId !== tenantId) {
      throw new NotFoundException('Application not found');
    }

    // Optimistic Concurrency Control
    if (dto.version !== undefined && application.version !== dto.version) {
      throw new ConflictException(
        'Application stage has been modified concurrently by another user. Please reload the candidate.',
      );
    }

    // Validate target stage belongs to the exact same job
    const targetStage = await this.jobStageModel.findById(dto.stageId).exec();
    if (!targetStage || targetStage.jobId !== application.jobId) {
      throw new BadRequestException('Target stage is invalid or does not belong to this job requisition');
    }

    const oldStageId = application.stageId;
    application.stageId = targetStage._id;
    application.version = (application.version || 1) + 1;

    // Check if target stage maps to hired or rejected
    if (targetStage.kind === StageKind.HIRED) {
      application.status = ApplicationStatus.HIRED;
    } else if (targetStage.kind === StageKind.REJECTED) {
      application.status = ApplicationStatus.REJECTED;
    }

    await application.save();

    // Record stage history
    const history = await this.stageHistoryModel.create({
      _id: uuidv4(),
      applicationId,
      tenantId,
      fromStageId: oldStageId,
      toStageId: targetStage._id,
      fromStatus: application.status,
      toStatus: application.status,
      actorId: user.userId,
      actorRole: user.role,
      reason: dto.reason || `Moved to ${targetStage.name}`,
      movedAt: new Date(),
    });

    // Notify candidate
    await this.notificationModel.create({
      _id: uuidv4(),
      userId: application.candidateId,
      tenantId,
      type: 'APPLICATION_STAGE_CHANGED',
      title: 'Application Update',
      message: `Your application has progressed to the "${targetStage.name}" stage.`,
      data: { applicationId, stageId: targetStage._id },
    });

    return {
      application,
      history,
    };
  }

  // Employer ATS: Reject application
  async rejectApplication(tenantId: string, applicationId: string, user: AuthenticatedUser, dto: RejectApplicationDto) {
    const application = await this.applicationModel.findById(applicationId).exec();
    if (!application || application.tenantId !== tenantId) {
      throw new NotFoundException('Application not found');
    }

    application.status = ApplicationStatus.REJECTED;
    application.rejectionReason = dto.reason;
    application.version = (application.version || 1) + 1;
    await application.save();

    await this.stageHistoryModel.create({
      _id: uuidv4(),
      applicationId,
      tenantId,
      fromStageId: application.stageId,
      toStageId: application.stageId,
      fromStatus: ApplicationStatus.ACTIVE,
      toStatus: ApplicationStatus.REJECTED,
      actorId: user.userId,
      actorRole: user.role,
      reason: `Rejected: ${dto.reason}`,
      movedAt: new Date(),
    });

    return { success: true, message: 'Application rejected' };
  }

  // Employer ATS: Mark hired
  async markHired(tenantId: string, applicationId: string, user: AuthenticatedUser) {
    const application = await this.applicationModel.findById(applicationId).exec();
    if (!application || application.tenantId !== tenantId) {
      throw new NotFoundException('Application not found');
    }

    const hiredStage = await this.jobStageModel.findOne({ jobId: application.jobId, kind: StageKind.HIRED }).exec();

    application.status = ApplicationStatus.HIRED;
    if (hiredStage) {
      application.stageId = hiredStage._id;
    }
    application.version = (application.version || 1) + 1;
    await application.save();

    await this.stageHistoryModel.create({
      _id: uuidv4(),
      applicationId,
      tenantId,
      fromStageId: application.stageId,
      toStageId: hiredStage ? hiredStage._id : application.stageId,
      fromStatus: ApplicationStatus.ACTIVE,
      toStatus: ApplicationStatus.HIRED,
      actorId: user.userId,
      actorRole: user.role,
      reason: 'Candidate officially hired',
      movedAt: new Date(),
    });

    return { success: true, message: 'Candidate marked as hired' };
  }

  // Employer ATS: Bulk Move
  async bulkMove(tenantId: string, user: AuthenticatedUser, dto: BulkMoveDto) {
    const results = [];
    for (const appId of dto.applicationIds) {
      try {
        const app = await this.applicationModel.findById(appId).exec();
        if (app && app.tenantId === tenantId) {
          const moveRes = await this.moveStage(tenantId, appId, user, {
            stageId: dto.stageId,
            version: app.version,
            reason: 'Bulk pipeline move',
          });
          results.push({ id: appId, success: true });
        }
      } catch (err: any) {
        results.push({ id: appId, success: false, error: err.message });
      }
    }
    return { results };
  }

  // Employer ATS: Bulk Reject
  async bulkReject(tenantId: string, user: AuthenticatedUser, dto: BulkRejectDto) {
    const results = [];
    for (const appId of dto.applicationIds) {
      try {
        const app = await this.applicationModel.findById(appId).exec();
        if (app && app.tenantId === tenantId) {
          await this.rejectApplication(tenantId, appId, user, { reason: dto.reason });
          results.push({ id: appId, success: true });
        }
      } catch (err: any) {
        results.push({ id: appId, success: false, error: err.message });
      }
    }
    return { results };
  }
}
