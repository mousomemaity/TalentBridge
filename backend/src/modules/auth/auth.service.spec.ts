import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../../database/schemas/user.schema';
import { Session } from '../../database/schemas/session.schema';
import { Tenant } from '../../database/schemas/tenant.schema';
import { TenantMember } from '../../database/schemas/tenant-member.schema';
import { CandidateProfile } from '../../database/schemas/candidate-profile.schema';
import { PipelineTemplate } from '../../database/schemas/pipeline-template.schema';
import { UserRole, UserStatus } from '../../common/constants/roles.enum';

describe('AuthService (Unit Tests)', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockSessionModel: any;
  let mockTenantModel: any;
  let mockTenantMemberModel: any;
  let mockCandidateProfileModel: any;
  let mockPipelineTemplateModel: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockSessionModel = {
      create: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      updateMany: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
    };
    mockTenantModel = {
      findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      create: jest.fn(),
    };
    mockTenantMemberModel = {
      findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      create: jest.fn(),
    };
    mockCandidateProfileModel = {
      create: jest.fn(),
    };
    mockPipelineTemplateModel = {
      create: jest.fn(),
    };
    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Session.name), useValue: mockSessionModel },
        { provide: getModelToken(Tenant.name), useValue: mockTenantModel },
        { provide: getModelToken(TenantMember.name), useValue: mockTenantMemberModel },
        { provide: getModelToken(CandidateProfile.name), useValue: mockCandidateProfileModel },
        { provide: getModelToken(PipelineTemplate.name), useValue: mockPipelineTemplateModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('Candidate Registration', () => {
    it('should register a candidate successfully and issue tokens', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const fakeUser = {
        _id: 'user-uuid-1',
        email: 'alex@example.com',
        role: UserRole.CANDIDATE,
        status: UserStatus.ACTIVE,
        firstName: 'Alex',
        lastName: 'Morgan',
        candidateId: 'profile-uuid-1',
      };
      mockUserModel.create.mockResolvedValue(fakeUser);
      mockCandidateProfileModel.create.mockResolvedValue({});
      mockSessionModel.create.mockResolvedValue({});

      const result = await service.registerCandidate({
        email: 'alex@example.com',
        password: 'Password123!',
        firstName: 'Alex',
        lastName: 'Morgan',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('alex@example.com');
      expect(result.user.role).toBe(UserRole.CANDIDATE);
      expect(mockCandidateProfileModel.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if candidate email already exists', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-id' }),
      });

      await expect(
        service.registerCandidate({
          email: 'alex@example.com',
          password: 'Password123!',
          firstName: 'Alex',
          lastName: 'Morgan',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('Employer Registration', () => {
    it('should create company tenant, admin user, and default pipeline', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      mockTenantModel.create.mockResolvedValue({
        _id: 'tenant-uuid-1',
        name: 'Acme Corp',
        slug: 'acme-corp',
        planId: 'free',
      });
      mockUserModel.create.mockResolvedValue({
        _id: 'employer-user-uuid',
        email: 'admin@acme.corp',
        role: UserRole.COMPANY_ADMIN,
        status: UserStatus.ACTIVE,
        firstName: 'Sarah',
        lastName: 'Connor',
        tenantId: 'tenant-uuid-1',
      });

      const result = await service.registerEmployer({
        email: 'admin@acme.corp',
        password: 'Password123!',
        firstName: 'Sarah',
        lastName: 'Connor',
        companyName: 'Acme Corp',
      });

      expect(result.tenant.name).toBe('Acme Corp');
      expect(result.user.role).toBe(UserRole.COMPANY_ADMIN);
      expect(mockPipelineTemplateModel.create).toHaveBeenCalled();
      expect(mockTenantMemberModel.create).toHaveBeenCalled();
    });
  });

  describe('Login', () => {
    it('should validate password and return sanitized user without password hash', async () => {
      const passwordHash = await bcrypt.hash('Password123!', 10);
      const userDoc = {
        _id: 'user-uuid-1',
        email: 'alex@example.com',
        passwordHash,
        role: UserRole.CANDIDATE,
        status: UserStatus.ACTIVE,
        firstName: 'Alex',
        lastName: 'Morgan',
        save: jest.fn().mockResolvedValue({}),
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userDoc),
      });

      const result = await service.login({
        email: 'alex@example.com',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const passwordHash = await bcrypt.hash('Password123!', 10);
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          email: 'alex@example.com',
          passwordHash,
          status: UserStatus.ACTIVE,
        }),
      });

      await expect(
        service.login({
          email: 'alex@example.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Refresh Token Rotation & Reuse Detection', () => {
    it('should detect refresh token reuse and invalidate the token family', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'user-id-1',
        sid: 'session-id-1',
      });

      mockSessionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'session-id-1',
          family: 'family-id-1',
          isRevoked: true, // Already revoked session used again!
        }),
      });

      await expect(service.refresh('compromised-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockSessionModel.updateMany).toHaveBeenCalledWith(
        { family: 'family-id-1' },
        { isRevoked: true },
      );
    });
  });
});
