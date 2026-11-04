import { Test } from '@nestjs/testing';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { JobsController } from '../src/modules/jobs/jobs.controller';
import { JobsService } from '../src/modules/jobs/jobs.service';
import { CandidatesController } from '../src/modules/candidates/candidates.controller';
import { CandidatesService } from '../src/modules/candidates/candidates.service';
import { ApplicationsController } from '../src/modules/applications/applications.controller';
import { ApplicationsService } from '../src/modules/applications/applications.service';
import { TenantsController } from '../src/modules/tenants/tenants.controller';
import { TenantsService } from '../src/modules/tenants/tenants.service';
import { ResumesController } from '../src/modules/resumes/resumes.controller';
import { FilesController } from '../src/modules/resumes/files.controller';
import { ResumesService } from '../src/modules/resumes/resumes.service';
import { SavedJobsController } from '../src/modules/saved-jobs/saved-jobs.controller';
import { SavedJobsService } from '../src/modules/saved-jobs/saved-jobs.service';
import { PipelinesController } from '../src/modules/pipelines/pipelines.controller';
import { PipelinesService } from '../src/modules/pipelines/pipelines.service';
import { AiController } from '../src/modules/ai/ai.controller';
import { AiService } from '../src/modules/ai/ai.service';
import { NotificationsController } from '../src/modules/notifications/notifications.controller';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import { InterviewsController } from '../src/modules/interviews/interviews.controller';
import { InterviewsService } from '../src/modules/interviews/interviews.service';
import { ReportsController } from '../src/modules/reports/reports.controller';
import { ReportsService } from '../src/modules/reports/reports.service';

async function generateOpenApi() {
  const dummyService = {};

  const moduleRef = await Test.createTestingModule({
    controllers: [
      AuthController,
      JobsController,
      CandidatesController,
      ApplicationsController,
      TenantsController,
      ResumesController,
      FilesController,
      SavedJobsController,
      PipelinesController,
      AiController,
      NotificationsController,
      InterviewsController,
      ReportsController,
    ],
    providers: [
      { provide: AuthService, useValue: dummyService },
      { provide: JobsService, useValue: dummyService },
      { provide: CandidatesService, useValue: dummyService },
      { provide: ApplicationsService, useValue: dummyService },
      { provide: TenantsService, useValue: dummyService },
      { provide: ResumesService, useValue: dummyService },
      { provide: SavedJobsService, useValue: dummyService },
      { provide: PipelinesService, useValue: dummyService },
      { provide: AiService, useValue: dummyService },
      { provide: NotificationsService, useValue: dummyService },
      { provide: InterviewsService, useValue: dummyService },
      { provide: ReportsService, useValue: dummyService },
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('TalentBridge Core API')
    .setDescription(
      'Official TalentBridge API Contract for Job Portal & Applicant Tracking System (ATS). Integrates Candidate Portal, Employer ATS, Shared Database, and AI Adapter.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT access token (Bearer <token>)',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Auth', 'Candidate & Employer authentication, sessions, refresh rotation')
    .addTag('Companies & Team', 'Company account profiles, team members, invitations')
    .addTag('Candidate Portal', 'Candidate self-owned profiles, skills, education, preferences')
    .addTag('Resumes', 'Resume registration, AI parsing, profile merging')
    .addTag('Files & Uploads', 'Presigned upload URLs')
    .addTag('Jobs', 'Public job board search, employer ATS requisitions, pipeline publication')
    .addTag('Applications', 'Job applications, Kanban stages, optimistic locking, activity history')
    .addTag('Pipelines & Stages', 'Pipeline templates, customizable job stages, reordering')
    .addTag('Saved Jobs & Alerts', 'Candidate saved job bookmarks, search alerts')
    .addTag('AI & Matching', 'AI matching explainability, recommendations, JD generator, bias checker')
    .addTag('Interviews & Assessments', 'Interview scheduling, scorecards, timed assessments')
    .addTag('Notifications', 'Candidate and employer real-time alerts and preferences')
    .addTag('Reports & Audit', 'Hiring funnel metrics, sourcing analytics, time-to-hire, audit trail')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const docsDir = path.resolve(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const jsonPath = path.join(docsDir, 'openapi.json');
  fs.writeFileSync(jsonPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI JSON successfully written to ${jsonPath}`);

  // Also write to top-level docs/openapi.json if desired for repo-wide visibility
  const repoDocsDir = path.resolve(__dirname, '..', '..', 'docs');
  if (!fs.existsSync(repoDocsDir)) {
    fs.mkdirSync(repoDocsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(repoDocsDir, 'openapi.json'), JSON.stringify(document, null, 2));
  console.log(`OpenAPI JSON copied to ${path.join(repoDocsDir, 'openapi.json')}`);

  await app.close();
}

generateOpenApi().catch((err) => {
  console.error('Failed to generate OpenAPI spec:', err);
  process.exit(1);
});
