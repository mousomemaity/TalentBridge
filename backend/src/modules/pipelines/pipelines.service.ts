import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { PipelineTemplate, PipelineTemplateDocument } from '../../database/schemas/pipeline-template.schema';
import { JobStage, JobStageDocument } from '../../database/schemas/job-stage.schema';
import { Job, JobDocument } from '../../database/schemas/job.schema';
import { CreatePipelineTemplateDto, AddJobStageDto, UpdateJobStageDto, ReorderStagesDto } from './dto/pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectModel(PipelineTemplate.name)
    private readonly pipelineTemplateModel: Model<PipelineTemplateDocument>,
    @InjectModel(JobStage.name) private readonly jobStageModel: Model<JobStageDocument>,
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
  ) {}

  async getTemplates(tenantId: string) {
    return this.pipelineTemplateModel.find({ tenantId }).sort({ createdAt: -1 }).exec();
  }

  async createTemplate(tenantId: string, dto: CreatePipelineTemplateDto) {
    return this.pipelineTemplateModel.create({
      _id: uuidv4(),
      tenantId,
      name: dto.name,
      stages: dto.stages.map((s, idx) => ({
        id: uuidv4(),
        name: s.name,
        kind: s.kind,
        position: s.position ?? idx,
        slaDays: s.slaDays ?? 3,
      })),
    });
  }

  async updateTemplate(tenantId: string, templateId: string, dto: Partial<CreatePipelineTemplateDto>) {
    const template = await this.pipelineTemplateModel.findOne({ _id: templateId, tenantId }).exec();
    if (!template) {
      throw new NotFoundException('Pipeline template not found');
    }
    if (dto.name) template.name = dto.name;
    if (dto.stages) {
      template.stages = dto.stages.map((s, idx) => ({
        id: uuidv4(),
        name: s.name,
        kind: s.kind,
        position: s.position ?? idx,
        slaDays: s.slaDays ?? 3,
      }));
    }
    return template.save();
  }

  async addStageToJob(tenantId: string, jobId: string, dto: AddJobStageDto) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job || job.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied to job');
    }

    const currentCount = await this.jobStageModel.countDocuments({ jobId }).exec();
    const stage = await this.jobStageModel.create({
      _id: uuidv4(),
      jobId,
      tenantId,
      name: dto.name,
      kind: dto.kind,
      position: dto.position !== undefined ? dto.position : currentCount,
      slaDays: dto.slaDays || 3,
    });

    return stage;
  }

  async updateJobStage(tenantId: string, stageId: string, dto: UpdateJobStageDto) {
    const stage = await this.jobStageModel.findOne({ _id: stageId, tenantId }).exec();
    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    if (dto.name) stage.name = dto.name;
    if (dto.slaDays !== undefined) stage.slaDays = dto.slaDays;
    return stage.save();
  }

  async reorderJobStages(tenantId: string, jobId: string, dto: ReorderStagesDto) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job || job.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied to job');
    }

    const updates = dto.orders.map((item) =>
      this.jobStageModel.updateOne(
        { _id: item.stageId, jobId, tenantId },
        { position: item.position },
      ),
    );
    await Promise.all(updates);

    return this.jobStageModel.find({ jobId }).sort({ position: 1 }).exec();
  }
}
