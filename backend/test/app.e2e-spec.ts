import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
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
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { UserRole } from '../src/common/constants/roles.enum';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../src/modules/auth/strategies/jwt.strategy';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/database/schemas/user.schema';

describe('TalentBridge API Endpoints (Integration E2E Tests)', () => {
  let app: INestApplication;
  let mockAuthService: any;
  let mockJobsService: any;
  let mockCandidatesService: any;
  let mockApplicationsService: any;
  let mockTenantsService: any;

  beforeAll(async () => {
    mockAuthService = {
      registerCandidate: jest.fn().mockResolvedValue({
        user: {
          id: 'user-uuid-1',
          email: 'candidate@example.com',
          role: UserRole.CANDIDATE,
          firstName: 'Alex',
          lastName: 'Morgan',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
      registerEmployer: jest.fn().mockResolvedValue({
        user: {
          id: 'emp-uuid-1',
          email: 'admin@acme.corp',
          role: UserRole.COMPANY_ADMIN,
        },
        tenant: {
          id: 'tenant-uuid-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
      login: jest.fn().mockResolvedValue({
        user: {
          id: 'user-uuid-1',
          email: 'candidate@example.com',
          role: UserRole.CANDIDATE,
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
      refresh: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
      logout: jest.fn().mockResolvedValue({ success: true, message: 'Logged out successfully' }),
    };

    mockJobsService = {
      searchPublicJobs: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'job-1',
            title: 'Staff Backend Architect',
            department: 'Core Infrastructure',
            location: 'Remote',
            salaryMin: 150000,
            salaryMax: 190000,
            currency: 'USD',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      }),
      getPublicJobBySlug: jest.fn().mockResolvedValue({
        id: 'job-1',
        title: 'Staff Backend Architect',
        slug: 'staff-backend-architect',
      }),
      getTenantJobs: jest.fn().mockResolvedValue([]),
    };

    mockCandidatesService = {
      getProfileByUserId: jest.fn().mockResolvedValue({
        id: 'profile-1',
        userId: 'user-uuid-1',
        skills: [{ name: 'TypeScript', level: 'EXPERT', yearsExperience: 5 }],
      }),
      updateProfile: jest.fn().mockResolvedValue({ success: true }),
    };

    mockApplicationsService = {
      applyForJob: jest.fn().mockResolvedValue({
        id: 'app-uuid-1',
        jobId: 'job-1',
        candidateId: 'user-uuid-1',
        status: 'ACTIVE',
        version: 1,
      }),
      getCandidateApplications: jest.fn().mockResolvedValue([]),
    };

    mockTenantsService = {
      getPublicCompanies: jest.fn().mockResolvedValue({
        data: [{ id: 'tenant-1', name: 'Acme Corp', slug: 'acme-corp' }],
        total: 1,
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [
        AuthController,
        JobsController,
        CandidatesController,
        ApplicationsController,
        TenantsController,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JobsService, useValue: mockJobsService },
        { provide: CandidatesService, useValue: mockCandidatesService },
        { provide: ApplicationsService, useValue: mockApplicationsService },
        { provide: TenantsService, useValue: mockTenantsService },
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
            }),
          },
        },
        JwtStrategy,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Public Job Board Endpoints', () => {
    it('GET /api/v1/jobs - should return 200 OK with job search listings', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/jobs').expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].title).toBe('Staff Backend Architect');
    });

    it('GET /api/v1/companies - should return 200 OK with company directory', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/companies').expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].name).toBe('Acme Corp');
    });
  });

  describe('Auth DTO Validation & Registration', () => {
    it('POST /api/v1/auth/register/candidate - should reject invalid payload with 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register/candidate')
        .send({
          email: 'invalid-email',
          password: '123',
        })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('POST /api/v1/auth/register/candidate - should register candidate and return tokens without password hash', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register/candidate')
        .send({
          email: 'candidate@example.com',
          password: 'Password123!',
          firstName: 'Alex',
          lastName: 'Morgan',
        })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.user.email).toBe('candidate@example.com');
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('POST /api/v1/auth/login - should authenticate user with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'candidate@example.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
    });
  });

  describe('Protected Endpoints & Authorization', () => {
    it('GET /api/v1/me/profile - should return 401 Unauthorized without Bearer token', async () => {
      await request(app.getHttpServer()).get('/api/v1/me/profile').expect(401);
    });

    it('GET /api/v1/app/jobs - should return 401 Unauthorized without Bearer token', async () => {
      await request(app.getHttpServer()).get('/api/v1/app/jobs').expect(401);
    });

    it('POST /api/v1/jobs/job-1/apply - should return 401 Unauthorized without Bearer token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/jobs/job-1/apply')
        .send({ coverLetter: 'Hello' })
        .expect(401);
    });
  });
});
