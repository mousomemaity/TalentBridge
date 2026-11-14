import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto, InviteMemberDto, UpdateMemberDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Companies & Team')
@Controller()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('tenant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user employer company profile' })
  async getOwnTenant(@CurrentUser() user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new UnauthorizedException('User is not associated with any company');
    }
    return this.tenantsService.getTenant(user.tenantId);
  }

  @Patch('tenant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company profile (Company Admin only)' })
  async updateOwnTenant(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateTenantDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('User is not associated with any company');
    }
    return this.tenantsService.updateTenant(user.tenantId, dto);
  }

  @Get('companies')
  @ApiOperation({ summary: 'Public company directory' })
  async getPublicCompanies(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.tenantsService.getPublicCompanies(Number(page), Number(limit));
  }

  @Get('companies/:slug')
  @ApiOperation({ summary: 'Public company profile by slug' })
  async getPublicCompanyBySlug(@Param('slug') slug: string) {
    return this.tenantsService.getPublicCompanyBySlug(slug);
  }

  @Get('team/members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List team members in own company' })
  async getTeamMembers(@CurrentUser() user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new UnauthorizedException('User is not associated with any company');
    }
    return this.tenantsService.getTeamMembers(user.tenantId);
  }

  @Post('team/invitations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a new team member to company' })
  async inviteTeamMember(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: InviteMemberDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('User is not associated with any company');
    }
    return this.tenantsService.inviteMember(user.tenantId, dto);
  }

  @Patch('team/members/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team member role or active status' })
  async updateTeamMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') memberId: string,
    @Body() dto: UpdateMemberDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('User is not associated with any company');
    }
    return this.tenantsService.updateMember(user.tenantId, memberId, dto);
  }
}
