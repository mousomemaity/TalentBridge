import mongoose, { Model } from 'mongoose';
import { ModelNames } from './config/database.constants';
import {
  Application,
  ApplicationDocument,
  ApplicationSchema,
  ApplicationStageHistory,
  ApplicationStageHistoryDocument,
  ApplicationStageHistorySchema,
  CandidateProfile,
  CandidateProfileDocument,
  CandidateProfileSchema,
  Company,
  CompanyDocument,
  CompanyMember,
  CompanyMemberDocument,
  CompanyMemberSchema,
  CompanySchema,
  Job,
  JobDocument,
  JobSchema,
  MatchResult,
  MatchResultDocument,
  MatchResultSchema,
  Notification,
  NotificationDocument,
  NotificationSchema,
  PipelineStage,
  PipelineStageDocument,
  PipelineStageSchema,
  Resume,
  ResumeDocument,
  ResumeSchema,
  SavedJob,
  SavedJobDocument,
  SavedJobSchema,
  SavedSearch,
  SavedSearchDocument,
  SavedSearchSchema,
  User,
  UserDocument,
  UserSchema,
} from './schemas';

export * from './config/database.config';
export * from './config/database.constants';
export * from './database.module';
export * from './enums';
export * from './interfaces';
export * from './schemas';

/**
 * Direct Mongoose Model Accessors (for non-NestJS scripts, seeds, and unit tests)
 */
export function getModel<T>(name: string, schema: mongoose.Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}

export const Models = {
  getUserModel: (): Model<UserDocument> => getModel<UserDocument>(ModelNames.USER, UserSchema),
  getCompanyModel: (): Model<CompanyDocument> =>
    getModel<CompanyDocument>(ModelNames.COMPANY, CompanySchema),
  getCompanyMemberModel: (): Model<CompanyMemberDocument> =>
    getModel<CompanyMemberDocument>(ModelNames.COMPANY_MEMBER, CompanyMemberSchema),
  getCandidateProfileModel: (): Model<CandidateProfileDocument> =>
    getModel<CandidateProfileDocument>(ModelNames.CANDIDATE_PROFILE, CandidateProfileSchema),
  getResumeModel: (): Model<ResumeDocument> =>
    getModel<ResumeDocument>(ModelNames.RESUME, ResumeSchema),
  getSavedJobModel: (): Model<SavedJobDocument> =>
    getModel<SavedJobDocument>(ModelNames.SAVED_JOB, SavedJobSchema),
  getSavedSearchModel: (): Model<SavedSearchDocument> =>
    getModel<SavedSearchDocument>(ModelNames.SAVED_SEARCH, SavedSearchSchema),
  getJobModel: (): Model<JobDocument> => getModel<JobDocument>(ModelNames.JOB, JobSchema),
  getApplicationModel: (): Model<ApplicationDocument> =>
    getModel<ApplicationDocument>(ModelNames.APPLICATION, ApplicationSchema),
  getPipelineStageModel: (): Model<PipelineStageDocument> =>
    getModel<PipelineStageDocument>(ModelNames.PIPELINE_STAGE, PipelineStageSchema),
  getApplicationStageHistoryModel: (): Model<ApplicationStageHistoryDocument> =>
    getModel<ApplicationStageHistoryDocument>(
      ModelNames.APPLICATION_STAGE_HISTORY,
      ApplicationStageHistorySchema,
    ),
  getNotificationModel: (): Model<NotificationDocument> =>
    getModel<NotificationDocument>(ModelNames.NOTIFICATION, NotificationSchema),
  getMatchResultModel: (): Model<MatchResultDocument> =>
    getModel<MatchResultDocument>(ModelNames.MATCH_RESULT, MatchResultSchema),
};
