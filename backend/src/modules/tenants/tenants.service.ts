import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Tenant, TenantDocument } from '../../database/schemas/tenant.schema';
import { TenantMember, TenantMemberDocument } from '../../database/schemas/tenant-member.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UserRole, UserStatus } from '../../common/constants/roles.enum';
import { UpdateTenantDto, InviteMemberDto, UpdateMemberDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
    @InjectModel(TenantMember.name) private readonly tenantMemberModel: Model<TenantMemberDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getTenant(tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }
    const tenant = await this.tenantModel.findById(tenantId).exec();
    if (!tenant) {
      throw new NotFoundException('Company not found');
    }
    return tenant;
  }

  async updateTenant(tenantId: string, dto: UpdateTenantDto) {
    const tenant = await this.getTenant(tenantId);
    if (dto.name) tenant.name = dto.name;
    if (dto.logoUrl) tenant.logoUrl = dto.logoUrl;
    if (dto.domain) tenant.domain = dto.domain;
    if (dto.settings) tenant.settings = { ...tenant.settings, ...dto.settings };
    return tenant.save();
  }

  async getPublicCompanies(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [companies, total] = await Promise.all([
      this.tenantModel.find({ status: 'active' }).skip(skip).limit(limit).select('name slug logoUrl domain settings').exec(),
      this.tenantModel.countDocuments({ status: 'active' }).exec(),
    ]);
    return { data: companies, total, page, limit };
  }

  async getPublicCompanyBySlug(slug: string) {
    const company = await this.tenantModel.findOne({ slug: slug.toLowerCase() }).select('name slug logoUrl domain settings createdAt').exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async getTeamMembers(tenantId: string) {
    const members = await this.tenantMemberModel.find({ tenantId }).exec();
    const userIds = members.map((m) => m.userId);
    const users = await this.userModel.find({ _id: { $in: userIds as any } }).select('firstName lastName email phone status').exec();
    const userMap = new Map<string, any>(users.map((u) => [String(u._id), u]));

    return members.map((m) => ({
      id: m._id,
      userId: m.userId,
      role: m.role,
      department: m.department,
      isActive: m.isActive,
      user: userMap.get(m.userId) || null,
      createdAt: m.createdAt,
    }));
  }

  async inviteMember(tenantId: string, dto: InviteMemberDto) {
    let user = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (!user) {
      const defaultPassword = await bcrypt.hash('Welcome123!', 10);
      user = await this.userModel.create({
        _id: uuidv4(),
        email: dto.email.toLowerCase(),
        passwordHash: defaultPassword,
        role: dto.role,
        status: UserStatus.ACTIVE,
        firstName: dto.firstName || 'Invited',
        lastName: dto.lastName || 'Member',
        tenantId,
      });
    }

    const existingMember = await this.tenantMemberModel.findOne({ tenantId, userId: user._id }).exec();
    if (existingMember) {
      throw new ConflictException('User is already a member of this company');
    }

    const member = await this.tenantMemberModel.create({
      _id: uuidv4(),
      tenantId,
      userId: user._id,
      role: dto.role,
      department: dto.department,
      isActive: true,
    });

    return {
      id: member._id,
      userId: user._id,
      email: user.email,
      role: member.role,
      department: member.department,
      message: 'Invitation processed and member added',
    };
  }

  async updateMember(tenantId: string, memberId: string, dto: UpdateMemberDto) {
    const member = await this.tenantMemberModel.findOne({ _id: memberId, tenantId }).exec();
    if (!member) {
      throw new NotFoundException('Team member not found in this company');
    }

    if (dto.role) member.role = dto.role;
    if (dto.department !== undefined) member.department = dto.department;
    if (dto.isActive !== undefined) member.isActive = dto.isActive;

    await member.save();
    return member;
  }
}
