import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { SavedJobsModule } from './modules/saved-jobs/saved-jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { PipelinesModule } from './modules/pipelines/pipelines.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    CandidatesModule,
    ResumesModule,
    JobsModule,
    SavedJobsModule,
    ApplicationsModule,
    PipelinesModule,
    AiModule,
    NotificationsModule,
    InterviewsModule,
    ReportsModule,
  ],
})
export class AppModule {}
