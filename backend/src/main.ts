import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global Prefix: all endpoints under /api/v1
  app.setGlobalPrefix('api/v1');

  // Security & Parsing
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global Validation Pipe with class-validator & class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global Filters & Interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger / OpenAPI Specification
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
  SwaggerModule.setup('docs', app, document);
  SwaggerModule.setup('api/v1/docs', app, document);

  // Export OpenAPI JSON specification for Frontend and AI teammates
  try {
    const docsDir = path.resolve(__dirname, '..', 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(docsDir, 'openapi.json'), JSON.stringify(document, null, 2));
    logger.log(`OpenAPI specification published to ${path.join(docsDir, 'openapi.json')}`);
  } catch (err: any) {
    logger.warn(`Could not write openapi.json file: ${err.message}`);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`TalentBridge API server running on port ${port} under /api/v1`);
  logger.log(`Swagger documentation available at http://localhost:${port}/docs`);
}

bootstrap();
