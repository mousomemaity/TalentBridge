import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { SavedJob, SavedJobDocument } from '../../database/schemas/saved-job.schema';
import { SavedSearch, SavedSearchDocument } from '../../database/schemas/saved-search.schema';
import { Job, JobDocument } from '../../database/schemas/job.schema';
import { Tenant, TenantDocument } from '../../database/schemas/tenant.schema';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';

@Injectable()
export class SavedJobsService {
  constructor(
    @InjectModel(SavedJob.name) private readonly savedJobModel: Model<SavedJobDocument>,
    @InjectModel(SavedSearch.name) private readonly savedSearchModel: Model<SavedSearchDocument>,
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
  ) {}

  async getSavedJobs(userId: string) {
    const saved = await this.savedJobModel.find({ userId }).sort({ createdAt: -1 }).exec();
    const jobIds = saved.map((s) => s.jobId);
    const jobs = await this.jobModel.find({ _id: { $in: jobIds as any } }).exec();

    const tenantIds = [...new Set(jobs.map((j) => j.tenantId))];
    const tenants = await this.tenantModel.find({ _id: { $in: tenantIds as any } }).select('name slug logoUrl').exec();
    const tenantMap = new Map<string, any>(tenants.map((t) => [String(t._id), t]));

    const jobMap = new Map<string, any>(
      jobs.map((j) => [
        String(j._id),
        {
          ...j.toObject(),
          company: tenantMap.get(j.tenantId) || null,
        },
      ]),
    );

    return saved.map((s) => ({
      id: s._id,
      jobId: s.jobId,
      savedAt: s.createdAt,
      job: jobMap.get(s.jobId) || null,
    }));
  }

  async saveJob(userId: string, jobId: string) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existing = await this.savedJobModel.findOne({ userId, jobId }).exec();
    if (existing) {
      return { success: true, message: 'Job is already saved', savedJob: existing };
    }

    try {
      const savedJob = await this.savedJobModel.create({
        _id: uuidv4(),
        userId,
        jobId,
      });
      return { success: true, message: 'Job saved successfully', savedJob };
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('Job is already saved');
      }
      throw err;
    }
  }

  async unsaveJob(userId: string, jobId: string) {
    const result = await this.savedJobModel.findOneAndDelete({ userId, jobId }).exec();
    if (!result) {
      throw new NotFoundException('Saved job record not found');
    }
    return { success: true, message: 'Job unsaved successfully' };
  }

  async getSavedSearches(userId: string) {
    return this.savedSearchModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async createSavedSearch(userId: string, dto: CreateSavedSearchDto) {
    return this.savedSearchModel.create({
      _id: uuidv4(),
      userId,
      name: dto.name,
      query: dto.query,
      filters: dto.filters || {},
      frequency: dto.frequency || 'DAILY',
    });
  }

  async deleteSavedSearch(userId: string, searchId: string) {
    const deleted = await this.savedSearchModel.findOneAndDelete({ _id: searchId, userId }).exec();
    if (!deleted) {
      throw new NotFoundException('Saved search not found');
    }
    return { success: true, message: 'Saved search deleted successfully' };
  }
}
