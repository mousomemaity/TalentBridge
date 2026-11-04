import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getDatabaseConfig } from './config/database.config';
import { ModelNames } from './config/database.constants';
import {
  Application,
  ApplicationSchema,
  ApplicationStageHistory,
  ApplicationStageHistorySchema,
  CandidateProfile,
  CandidateProfileSchema,
  Company,
  CompanyMember,
  CompanyMemberSchema,
  CompanySchema,
  Job,
  JobSchema,
  MatchResult,
  MatchResultSchema,
  Notification,
  NotificationSchema,
  PipelineStage,
  PipelineStageSchema,
  Resume,
  ResumeSchema,
  SavedJob,
  SavedJobSchema,
  SavedSearch,
  SavedSearchSchema,
  User,
  UserSchema,
} from './schemas';

const FEATURE_MODELS = [
  { name: ModelNames.USER, schema: UserSchema },
  { name: ModelNames.COMPANY, schema: CompanySchema },
  { name: ModelNames.COMPANY_MEMBER, schema: CompanyMemberSchema },
  { name: ModelNames.CANDIDATE_PROFILE, schema: CandidateProfileSchema },
  { name: ModelNames.RESUME, schema: ResumeSchema },
  { name: ModelNames.SAVED_JOB, schema: SavedJobSchema },
  { name: ModelNames.SAVED_SEARCH, schema: SavedSearchSchema },
  { name: ModelNames.JOB, schema: JobSchema },
  { name: ModelNames.APPLICATION, schema: ApplicationSchema },
  { name: ModelNames.PIPELINE_STAGE, schema: PipelineStageSchema },
  { name: ModelNames.APPLICATION_STAGE_HISTORY, schema: ApplicationStageHistorySchema },
  { name: ModelNames.NOTIFICATION, schema: NotificationSchema },
  { name: ModelNames.MATCH_RESULT, schema: MatchResultSchema },
];

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(customUri?: string): DynamicModule {
    const config = customUri ? { uri: customUri, options: {} } : getDatabaseConfig();

    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRoot(config.uri, config.options),
        MongooseModule.forFeature(FEATURE_MODELS),
      ],
      exports: [MongooseModule],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => {
            const config = getDatabaseConfig();
            return {
              uri: config.uri,
              ...config.options,
            };
          },
        }),
        MongooseModule.forFeature(FEATURE_MODELS),
      ],
      exports: [MongooseModule],
    };
  }
}
