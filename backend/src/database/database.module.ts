import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { TenantMember, TenantMemberSchema } from './schemas/tenant-member.schema';
import { CandidateProfile, CandidateProfileSchema } from './schemas/candidate-profile.schema';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import { Job, JobSchema } from './schemas/job.schema';
import { JobStage, JobStageSchema } from './schemas/job-stage.schema';
import { PipelineTemplate, PipelineTemplateSchema } from './schemas/pipeline-template.schema';
import { TenantCandidate, TenantCandidateSchema } from './schemas/tenant-candidate.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { ApplicationStageHistory, ApplicationStageHistorySchema } from './schemas/application-stage-history.schema';
import { SavedJob, SavedJobSchema } from './schemas/saved-job.schema';
import { SavedSearch, SavedSearchSchema } from './schemas/saved-search.schema';
import { Interview, InterviewSchema } from './schemas/interview.schema';
import { Scorecard, ScorecardSchema } from './schemas/scorecard.schema';
import { Assessment, AssessmentSchema } from './schemas/assessment.schema';
import { AssessmentAttempt, AssessmentAttemptSchema } from './schemas/assessment-attempt.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { MatchScore, MatchScoreSchema } from './schemas/match-score.schema';

const schemas = [
  { name: User.name, schema: UserSchema },
  { name: Session.name, schema: SessionSchema },
  { name: Tenant.name, schema: TenantSchema },
  { name: TenantMember.name, schema: TenantMemberSchema },
  { name: CandidateProfile.name, schema: CandidateProfileSchema },
  { name: Resume.name, schema: ResumeSchema },
  { name: Job.name, schema: JobSchema },
  { name: JobStage.name, schema: JobStageSchema },
  { name: PipelineTemplate.name, schema: PipelineTemplateSchema },
  { name: TenantCandidate.name, schema: TenantCandidateSchema },
  { name: Application.name, schema: ApplicationSchema },
  { name: ApplicationStageHistory.name, schema: ApplicationStageHistorySchema },
  { name: SavedJob.name, schema: SavedJobSchema },
  { name: SavedSearch.name, schema: SavedSearchSchema },
  { name: Interview.name, schema: InterviewSchema },
  { name: Scorecard.name, schema: ScorecardSchema },
  { name: Assessment.name, schema: AssessmentSchema },
  { name: AssessmentAttempt.name, schema: AssessmentAttemptSchema },
  { name: Notification.name, schema: NotificationSchema },
  { name: AuditLog.name, schema: AuditLogSchema },
  { name: MatchScore.name, schema: MatchScoreSchema },
];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talentbridge',
        serverSelectionTimeoutMS: 5000,
        autoIndex: true,
      }),
    }),
    MongooseModule.forFeature(schemas),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
