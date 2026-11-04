import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Job, JobDocument } from '../../database/schemas/job.schema';
import { JobStage, JobStageDocument } from '../../database/schemas/job-stage.schema';
import { PipelineTemplate, PipelineTemplateDocument } from '../../database/schemas/pipeline-template.schema';
import { Tenant, TenantDocument } from '../../database/schemas/tenant.schema';
import { JobStatus, StageKind } from '../../common/constants/roles.enum';
import { CreateJobDto, UpdateJobDto, JobSearchQueryDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(JobStage.name) private readonly jobStageModel: Model<JobStageDocument>,
    @InjectModel(PipelineTemplate.name)
    private readonly pipelineTemplateModel: Model<PipelineTemplateDocument>,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
  ) {}

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Public Job Search
  async searchPublicJobs(query: JobSearchQueryDto) {
    const filter: any = { status: JobStatus.PUBLISHED };

    if (query.q) {
      const regex = new RegExp(query.q, 'i');
      filter.$or = [{ title: regex }, { description: regex }, { skills: { $in: [regex] } }];
    }
    if (query.location) {
      filter.location = new RegExp(query.location, 'i');
    }
    if (query.workplaceType) {
      filter.workplaceType = query.workplaceType;
    }
    if (query.jobType) {
      filter.jobType = query.jobType;
    }
    if (query.department) {
      filter.department = new RegExp(query.department, 'i');
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      this.jobModel.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit).exec(),
      this.jobModel.countDocuments(filter).exec(),
    ]);

    // Attach company name & logo
    const tenantIds = [...new Set(jobs.map((j) => j.tenantId))];
    const tenants = await this.tenantModel.find({ _id: { $in: tenantIds as any } }).select('name slug logoUrl').exec();
    const tenantMap = new Map<string, any>(tenants.map((t) => [String(t._id), t]));

    const populatedJobs = jobs.map((job) => {
      const company = tenantMap.get(job.tenantId);
      return {
        ...job.toObject(),
        company: company ? { name: company.name, slug: company.slug, logoUrl: company.logoUrl } : null,
      };
    });

    return {
      data: populatedJobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Public Job Detail
  async getPublicJobBySlug(slug: string) {
    const job = await this.jobModel.findOne({ slug: slug.toLowerCase(), status: JobStatus.PUBLISHED }).exec();
    if (!job) {
      throw new NotFoundException('Job not found or is no longer published');
    }

    const company = await this.tenantModel.findById(job.tenantId).select('name slug logoUrl domain settings').exec();
    return {
      ...job.toObject(),
      company: company ? { name: company.name, slug: company.slug, logoUrl: company.logoUrl, domain: company.domain } : null,
    };
  }

  // Employer ATS: List tenant jobs
  async getTenantJobs(tenantId: string, status?: JobStatus) {
    const filter: any = { tenantId };
    if (status) {
      filter.status = status;
    }
    return this.jobModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  // Employer ATS: Create job draft
  async createJob(tenantId: string, dto: CreateJobDto, userId: string) {
    let slug = dto.slug ? this.generateSlug(dto.slug) : this.generateSlug(dto.title);
    const existing = await this.jobModel.findOne({ tenantId, slug }).exec();
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const jobId = uuidv4();

    // Copy pipeline stages from default template
    const template = await this.pipelineTemplateModel.findOne({ tenantId, isDefault: true }).exec()
      || await this.pipelineTemplateModel.findOne({ tenantId }).exec();

    const stagesToCreate = template?.stages?.length
      ? template.stages.map((s, idx) => ({
          _id: uuidv4(),
          jobId,
          tenantId,
          name: s.name,
          kind: s.kind,
          position: s.position ?? idx,
          slaDays: s.slaDays ?? 3,
        }))
      : [
          { _id: uuidv4(), jobId, tenantId, name: 'Applied', kind: StageKind.APPLIED, position: 0, slaDays: 3 },
          { _id: uuidv4(), jobId, tenantId, name: 'Screening', kind: StageKind.SCREEN, position: 1, slaDays: 3 },
          { _id: uuidv4(), jobId, tenantId, name: 'Interview', kind: StageKind.INTERVIEW, position: 2, slaDays: 5 },
          { _id: uuidv4(), jobId, tenantId, name: 'Offer', kind: StageKind.OFFER, position: 3, slaDays: 3 },
          { _id: uuidv4(), jobId, tenantId, name: 'Hired', kind: StageKind.HIRED, position: 4, slaDays: 0 },
          { _id: uuidv4(), jobId, tenantId, name: 'Rejected', kind: StageKind.REJECTED, position: 5, slaDays: 0 },
        ];

    await this.jobStageModel.insertMany(stagesToCreate);

    const job = await this.jobModel.create({
      _id: jobId,
      tenantId,
      title: dto.title,
      slug,
      department: dto.department,
      location: dto.location,
      jobType: dto.jobType,
      workplaceType: dto.workplaceType,
      salaryMin: dto.salaryMin,
      salaryMax: dto.salaryMax,
      currency: dto.currency || 'USD',
      description: dto.description,
      requirements: dto.requirements || [],
      skills: dto.skills || [],
      benefits: dto.benefits || [],
      openings: dto.openings || 1,
      status: JobStatus.DRAFT,
      screeningQuestions: dto.screeningQuestions || [],
      hiringTeam: {
        recruiterIds: [userId],
      },
    });

    return job;
  }

  // Employer ATS: Get job by ID with stages
  async getTenantJobById(tenantId: string, jobId: string) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException('Job requisition not found');
    }
    if (job.tenantId !== tenantId) {
      throw new ForbiddenException('Tenant access denied to this job');
    }

    const stages = await this.jobStageModel.find({ jobId }).sort({ position: 1 }).exec();
    return {
      ...job.toObject(),
      stages,
    };
  }

  // Employer ATS: Update job
  async updateJob(tenantId: string, jobId: string, dto: UpdateJobDto) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException('Job requisition not found');
    }
    if (job.tenantId !== tenantId) {
      throw new ForbiddenException('Tenant access denied to this job');
    }

    Object.assign(job, dto);
    return job.save();
  }

  // Employer ATS: Publish job
  async publishJob(tenantId: string, jobId: string) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException('Job requisition not found');
    }
    if (job.tenantId !== tenantId) {
      throw new ForbiddenException('Tenant access denied');
    }

    job.status = JobStatus.PUBLISHED;
    job.publishedAt = new Date();
    return job.save();
  }

  // Employer ATS: Pause job
  async pauseJob(tenantId: string, jobId: string) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job || job.tenantId !== tenantId) {
      throw new NotFoundException('Job not found');
    }
    job.status = JobStatus.PAUSED;
    return job.save();
  }

  // Employer ATS: Close job
  async closeJob(tenantId: string, jobId: string) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job || job.tenantId !== tenantId) {
      throw new NotFoundException('Job not found');
    }
    job.status = JobStatus.CLOSED;
    job.closesAt = new Date();
    return job.save();
  }

  // Employer ATS: Duplicate job
  async duplicateJob(tenantId: string, jobId: string, userId: string) {
    const original = await this.jobModel.findById(jobId).exec();
    if (!original || original.tenantId !== tenantId) {
      throw new NotFoundException('Job not found');
    }

    const createDto: CreateJobDto = {
      title: `${original.title} (Copy)`,
      department: original.department,
      location: original.location,
      jobType: original.jobType,
      workplaceType: original.workplaceType,
      salaryMin: original.salaryMin,
      salaryMax: original.salaryMax,
      currency: original.currency,
      description: original.description,
      requirements: original.requirements,
      skills: original.skills,
      benefits: original.benefits,
      openings: original.openings,
      screeningQuestions: original.screeningQuestions,
    };

    return this.createJob(tenantId, createDto, userId);
  }
}
