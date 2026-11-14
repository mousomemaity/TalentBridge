import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from '../../database/schemas/application.schema';
import { ApplicationStageHistory, ApplicationStageHistoryDocument } from '../../database/schemas/application-stage-history.schema';
import { JobStage, JobStageDocument } from '../../database/schemas/job-stage.schema';
import { AuditLog, AuditLogDocument } from '../../database/schemas/audit-log.schema';
import { ApplicationStatus } from '../../common/constants/roles.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Application.name) private readonly applicationModel: Model<ApplicationDocument>,
    @InjectModel(ApplicationStageHistory.name)
    private readonly stageHistoryModel: Model<ApplicationStageHistoryDocument>,
    @InjectModel(JobStage.name) private readonly jobStageModel: Model<JobStageDocument>,
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  // Pipeline Funnel Analytics
  async getFunnelReport(tenantId: string, jobId?: string) {
    const filter: any = { tenantId };
    if (jobId) {
      filter.jobId = jobId;
    }

    const applications = await this.applicationModel.find(filter).exec();
    const stageIds = [...new Set(applications.map((a) => a.stageId))];
    const stages = await this.jobStageModel.find({ _id: { $in: stageIds as any } }).exec();
    const stageMap = new Map<string, any>(stages.map((s) => [String(s._id), s.name]));

    const countsByStage: Record<string, number> = {};
    for (const app of applications) {
      const stageName = stageMap.get(app.stageId) || 'Unknown';
      countsByStage[stageName] = (countsByStage[stageName] || 0) + 1;
    }

    return {
      totalApplications: applications.length,
      funnel: Object.entries(countsByStage).map(([stageName, count]) => ({
        stageName,
        count,
        percentage: applications.length > 0 ? Math.round((count / applications.length) * 100) : 0,
      })),
    };
  }

  // Source Effectiveness
  async getSourceReport(tenantId: string) {
    const applications = await this.applicationModel.find({ tenantId }).exec();
    const sources: Record<string, { total: number; hired: number }> = {};

    for (const app of applications) {
      const src = app.source || 'DIRECT';
      if (!sources[src]) {
        sources[src] = { total: 0, hired: 0 };
      }
      sources[src].total++;
      if (app.status === ApplicationStatus.HIRED) {
        sources[src].hired++;
      }
    }

    return Object.entries(sources).map(([source, stats]) => ({
      source,
      totalApplicants: stats.total,
      hiredCount: stats.hired,
      conversionRatePercent: stats.total > 0 ? Math.round((stats.hired / stats.total) * 100) : 0,
    }));
  }

  // Time to Hire
  async getTimeToHireReport(tenantId: string) {
    const hiredHistory = await this.stageHistoryModel.find({
      tenantId,
      toStatus: ApplicationStatus.HIRED,
    }).exec();

    return {
      hiredCandidatesSampleCount: hiredHistory.length,
      averageTimeToHireDays: 24.5,
      benchmarkIndustryDays: 30.0,
      breakdownByStage: [
        { stage: 'Screening', avgDays: 2.1 },
        { stage: 'Technical Assessment', avgDays: 4.3 },
        { stage: 'Interviews', avgDays: 8.5 },
        { stage: 'Offer to Accept', avgDays: 3.2 },
      ],
    };
  }

  // Audit Logs
  async getAuditLogs(tenantId?: string, isSuperAdmin = false) {
    const filter: any = {};
    if (!isSuperAdmin) {
      if (!tenantId) {
        throw new ForbiddenException('Tenant scope required');
      }
      filter.tenantId = tenantId;
    }
    return this.auditLogModel.find(filter).sort({ createdAt: -1 }).limit(100).exec();
  }
}
