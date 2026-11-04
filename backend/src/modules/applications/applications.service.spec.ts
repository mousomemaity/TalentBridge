import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from '../../database/schemas/application.schema';
import { ApplicationStageHistory } from '../../database/schemas/application-stage-history.schema';
import { Job } from '../../database/schemas/job.schema';
import { JobStage } from '../../database/schemas/job-stage.schema';
import { TenantCandidate } from '../../database/schemas/tenant-candidate.schema';
import { User } from '../../database/schemas/user.schema';
import { Resume } from '../../database/schemas/resume.schema';
import { Notification } from '../../database/schemas/notification.schema';
import { JobStatus, StageKind, UserRole, ApplicationStatus } from '../../common/constants/roles.enum';

describe('ApplicationsService (Application & Stage Transition Tests)', () => {
  let service: ApplicationsService;
  let mockApplicationModel: any;
  let mockStageHistoryModel: any;
  let mockJobModel: any;
  let mockJobStageModel: any;
  let mockTenantCandidateModel: any;
  let mockUserModel: any;
  let mockResumeModel: any;
  let mockNotificationModel: any;

  beforeEach(async () => {
    mockApplicationModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };
    mockStageHistoryModel = {
      create: jest.fn(),
      find: jest.fn(),
    };
    mockJobModel = {
      findById: jest.fn(),
      find: jest.fn(),
    };
    mockJobStageModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
    };
    mockTenantCandidateModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    mockUserModel = {
      findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ email: 'alex@example.com' }) }),
      find: jest.fn(),
    };
    mockResumeModel = {
      findById: jest.fn(),
    };
    mockNotificationModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: getModelToken(Application.name), useValue: mockApplicationModel },
        { provide: getModelToken(ApplicationStageHistory.name), useValue: mockStageHistoryModel },
        { provide: getModelToken(Job.name), useValue: mockJobModel },
        { provide: getModelToken(JobStage.name), useValue: mockJobStageModel },
        { provide: getModelToken(TenantCandidate.name), useValue: mockTenantCandidateModel },
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Resume.name), useValue: mockResumeModel },
        { provide: getModelToken(Notification.name), useValue: mockNotificationModel },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('Job Application Uniqueness & Submission', () => {
    it('should submit an application successfully if job is published and candidate has not applied', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'job-1',
          tenantId: 'tenant-1',
          title: 'Software Engineer',
          status: JobStatus.PUBLISHED,
        }),
      });

      mockApplicationModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // No existing application
      });

      mockJobStageModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'stage-applied-1', kind: StageKind.APPLIED }),
      });

      mockTenantCandidateModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'tc-1' }),
      });

      mockApplicationModel.create.mockResolvedValue({
        _id: 'app-uuid-1',
        jobId: 'job-1',
        candidateId: 'user-candidate-1',
        stageId: 'stage-applied-1',
        status: ApplicationStatus.ACTIVE,
        version: 1,
      });

      const user = {
        userId: 'user-candidate-1',
        email: 'alex@example.com',
        role: UserRole.CANDIDATE,
      };

      const result = await service.applyForJob('job-1', user, { coverLetter: 'Hello' });

      expect(result).toHaveProperty('jobId', 'job-1');
      expect(mockStageHistoryModel.create).toHaveBeenCalled();
      expect(mockNotificationModel.create).toHaveBeenCalled();
    });

    it('should enforce one application per candidate per job and throw ConflictException', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'job-1',
          tenantId: 'tenant-1',
          status: JobStatus.PUBLISHED,
        }),
      });

      // Existing application found
      mockApplicationModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'existing-app-1',
          jobId: 'job-1',
          candidateId: 'user-candidate-1',
        }),
      });

      const user = {
        userId: 'user-candidate-1',
        email: 'alex@example.com',
        role: UserRole.CANDIDATE,
      };

      await expect(service.applyForJob('job-1', user, {})).rejects.toThrow(ConflictException);
    });

    it('should reject application if job is not published (e.g. DRAFT)', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'job-1',
          status: JobStatus.DRAFT,
        }),
      });

      const user = {
        userId: 'user-candidate-1',
        email: 'alex@example.com',
        role: UserRole.CANDIDATE,
      };

      await expect(service.applyForJob('job-1', user, {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('Stage Transitions & Optimistic Locking', () => {
    it('should move stage, increment version, and record stage history', async () => {
      const mockAppDoc = {
        _id: 'app-1',
        tenantId: 'tenant-1',
        jobId: 'job-1',
        candidateId: 'candidate-1',
        stageId: 'stage-1',
        version: 1,
        status: ApplicationStatus.ACTIVE,
        save: jest.fn().mockResolvedValue({}),
      };

      mockApplicationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAppDoc),
      });

      mockJobStageModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'stage-interview-2',
          jobId: 'job-1',
          name: 'Interview Panel',
          kind: StageKind.INTERVIEW,
        }),
      });

      const actor = {
        userId: 'recruiter-1',
        email: 'recruiter@acme.com',
        role: UserRole.RECRUITER,
        tenantId: 'tenant-1',
      };

      const result = await service.moveStage('tenant-1', 'app-1', actor, {
        stageId: 'stage-interview-2',
        version: 1,
        reason: 'Passed technical screening',
      });

      expect(mockAppDoc.stageId).toBe('stage-interview-2');
      expect(mockAppDoc.version).toBe(2);
      expect(mockStageHistoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fromStageId: 'stage-1',
          toStageId: 'stage-interview-2',
          actorId: 'recruiter-1',
          actorRole: UserRole.RECRUITER,
          reason: 'Passed technical screening',
        }),
      );
      expect(mockNotificationModel.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if optimistic lock version does not match', async () => {
      const mockAppDoc = {
        _id: 'app-1',
        tenantId: 'tenant-1',
        jobId: 'job-1',
        version: 2, // Modified concurrently by someone else
      };

      mockApplicationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAppDoc),
      });

      const actor = {
        userId: 'recruiter-1',
        email: 'recruiter@acme.com',
        role: UserRole.RECRUITER,
        tenantId: 'tenant-1',
      };

      await expect(
        service.moveStage('tenant-1', 'app-1', actor, {
          stageId: 'stage-interview-2',
          version: 1, // Stale version provided by caller
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
