import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Session, SessionDocument } from '../../database/schemas/session.schema';
import { Tenant, TenantDocument } from '../../database/schemas/tenant.schema';
import { TenantMember, TenantMemberDocument } from '../../database/schemas/tenant-member.schema';
import { CandidateProfile, CandidateProfileDocument } from '../../database/schemas/candidate-profile.schema';
import { PipelineTemplate, PipelineTemplateDocument } from '../../database/schemas/pipeline-template.schema';
import { UserRole, UserStatus, StageKind } from '../../common/constants/roles.enum';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterEmployerDto } from './dto/register-employer.dto';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/login.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
    @InjectModel(TenantMember.name) private readonly tenantMemberModel: Model<TenantMemberDocument>,
    @InjectModel(CandidateProfile.name) private readonly candidateProfileModel: Model<CandidateProfileDocument>,
    @InjectModel(PipelineTemplate.name) private readonly pipelineTemplateModel: Model<PipelineTemplateDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: UserDocument | any) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.passwordHash;
    delete obj.verificationToken;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    delete obj.__v;
    return {
      id: obj._id || obj.id,
      email: obj.email,
      role: obj.role,
      status: obj.status,
      firstName: obj.firstName,
      lastName: obj.lastName,
      phone: obj.phone,
      tenantId: obj.tenantId,
      candidateId: obj.candidateId,
      mfaEnabled: obj.mfaEnabled,
      emailVerified: obj.emailVerified,
      createdAt: obj.createdAt,
    };
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async generateTokens(user: { id: string; email: string; role: UserRole; tenantId?: string; candidateId?: string }, sessionId: string) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      candidateId: user.candidateId,
      sid: sessionId,
    };

    const accessSecret = process.env.JWT_ACCESS_SECRET || 'talentbridge-super-secret-jwt-key';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'talentbridge-super-secret-refresh-key';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async registerCandidate(dto: RegisterCandidateDto, ip?: string, userAgent?: string) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);
    const userId = uuidv4();
    const candidateId = uuidv4();

    // Create candidate profile
    await this.candidateProfileModel.create({
      _id: candidateId,
      userId,
      skills: [],
      experiences: [],
      educations: [],
      preferences: {},
      visibility: 'PUBLIC',
      openToWork: true,
    });

    // Create user
    const user = await this.userModel.create({
      _id: userId,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: UserRole.CANDIDATE,
      status: UserStatus.ACTIVE,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      candidateId,
      emailVerified: false,
    });

    const sessionId = uuidv4();
    const tokens = await this.generateTokens(
      { id: user._id, email: user.email, role: user.role, candidateId: user.candidateId },
      sessionId,
    );

    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionModel.create({
      _id: sessionId,
      userId: user._id,
      refreshTokenHash: refreshHash,
      family: sessionId,
      expiresAt,
      ipAddress: ip,
      userAgent,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async registerEmployer(dto: RegisterEmployerDto, ip?: string, userAgent?: string) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    let slug = dto.companySlug ? this.generateSlug(dto.companySlug) : this.generateSlug(dto.companyName);
    const existingTenant = await this.tenantModel.findOne({ slug }).exec();
    if (existingTenant) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const tenantId = uuidv4();
    const userId = uuidv4();

    // Create Tenant / Company
    const tenant = await this.tenantModel.create({
      _id: tenantId,
      name: dto.companyName,
      slug,
      domain: dto.domain,
      domainVerified: false,
      planId: 'free',
      status: 'active',
      settings: {},
    });

    // Create default pipeline template
    await this.pipelineTemplateModel.create({
      _id: uuidv4(),
      tenantId,
      name: 'Standard ATS Pipeline',
      isDefault: true,
      stages: [
        { id: uuidv4(), name: 'Applied', kind: StageKind.APPLIED, position: 0, slaDays: 3 },
        { id: uuidv4(), name: 'Screening', kind: StageKind.SCREEN, position: 1, slaDays: 3 },
        { id: uuidv4(), name: 'Interview', kind: StageKind.INTERVIEW, position: 2, slaDays: 5 },
        { id: uuidv4(), name: 'Offer', kind: StageKind.OFFER, position: 3, slaDays: 3 },
        { id: uuidv4(), name: 'Hired', kind: StageKind.HIRED, position: 4, slaDays: 0 },
        { id: uuidv4(), name: 'Rejected', kind: StageKind.REJECTED, position: 5, slaDays: 0 },
      ],
    });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create User as COMPANY_ADMIN
    const user = await this.userModel.create({
      _id: userId,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: UserRole.COMPANY_ADMIN,
      status: UserStatus.ACTIVE,
      firstName: dto.firstName,
      lastName: dto.lastName,
      tenantId,
      emailVerified: false,
    });

    // Link TenantMember
    await this.tenantMemberModel.create({
      _id: uuidv4(),
      tenantId,
      userId,
      role: UserRole.COMPANY_ADMIN,
      isActive: true,
    });

    const sessionId = uuidv4();
    const tokens = await this.generateTokens(
      { id: user._id, email: user.email, role: user.role, tenantId: user.tenantId },
      sessionId,
    );

    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionModel.create({
      _id: sessionId,
      userId: user._id,
      refreshTokenHash: refreshHash,
      family: sessionId,
      expiresAt,
      ipAddress: ip,
      userAgent,
    });

    return {
      user: this.sanitizeUser(user),
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain,
        planId: tenant.planId,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('This account has been suspended');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const sessionId = uuidv4();
    const tokens = await this.generateTokens(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        candidateId: user.candidateId,
      },
      sessionId,
    );

    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionModel.create({
      _id: sessionId,
      userId: user._id,
      refreshTokenHash: refreshHash,
      family: sessionId,
      expiresAt,
      ipAddress: ip,
      userAgent,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'talentbridge-super-secret-refresh-key';
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, { secret: refreshSecret });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const session = await this.sessionModel.findById(payload.sid).exec();
    if (!session || session.isRevoked) {
      // Reuse detected! Invalidate the entire token family
      if (session?.family) {
        await this.sessionModel.updateMany({ family: session.family }, { isRevoked: true }).exec();
      }
      throw new UnauthorizedException('Refresh token reuse detected. Session has been revoked.');
    }

    const isMatch = await bcrypt.compare(refreshToken, session.refreshTokenHash);
    if (!isMatch) {
      await this.sessionModel.updateMany({ family: session.family }, { isRevoked: true }).exec();
      throw new UnauthorizedException('Invalid refresh token signature');
    }

    const user = await this.userModel.findById(payload.sub).exec();
    if (!user || user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('User account no longer active');
    }

    // Revoke old session and rotate into new session within the same family
    session.isRevoked = true;
    await session.save();

    const newSessionId = uuidv4();
    const newTokens = await this.generateTokens(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        candidateId: user.candidateId,
      },
      newSessionId,
    );

    const newRefreshHash = await bcrypt.hash(newTokens.refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionModel.create({
      _id: newSessionId,
      userId: user._id,
      refreshTokenHash: newRefreshHash,
      family: session.family,
      expiresAt,
    });

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  }

  async logout(sessionId?: string) {
    if (sessionId) {
      await this.sessionModel.findByIdAndUpdate(sessionId, { isRevoked: true }).exec();
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (user) {
      user.resetPasswordToken = uuidv4();
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);
      user.resetPasswordExpires = expires;
      await user.save();
    }

    // Always return generic response to prevent email enumeration
    return {
      success: true,
      message: 'If an account exists with this email, instructions to reset your password have been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      resetPasswordToken: dto.token,
      resetPasswordExpires: { $gt: new Date() },
    }).exec();

    if (!user) {
      throw new BadRequestException('Password reset token is invalid or has expired');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(dto.newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Revoke all sessions for security
    await this.sessionModel.updateMany({ userId: user._id }, { isRevoked: true }).exec();

    return { success: true, message: 'Password has been reset successfully' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.userModel.findOne({ verificationToken: dto.token }).exec();
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return { success: true, message: 'Email has been verified successfully' };
  }
}
