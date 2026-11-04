import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import {
  ApplyJobDto,
  MoveStageDto,
  RejectApplicationDto,
  BulkMoveDto,
  BulkRejectDto,
} from './dto/apply-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Applications')
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Candidate Application Endpoints
  @Post('jobs/:id/apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for a published job (one application per candidate per job)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 409, description: 'Duplicate application detected' })
  async apply(
    @Param('id') jobId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ApplyJobDto,
  ) {
    return this.applicationsService.applyForJob(jobId, user, dto);
  }

  @Get('me/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List candidate submitted applications' })
  async getMyApplications(@CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.getCandidateApplications(user.userId);
  }

  @Get('me/applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get candidate application details and status timeline' })
  async getMyApplicationById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
  ) {
    return this.applicationsService.getCandidateApplicationById(user.userId, applicationId);
  }

  @Post('me/applications/:id/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw candidate application' })
  async withdrawApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
  ) {
    return this.applicationsService.withdrawApplication(user.userId, applicationId);
  }

  // Employer ATS Endpoints
  @Get('app/jobs/:id/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get job pipeline candidates grouped by stage (Kanban)' })
  async getJobApplications(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.applicationsService.getJobApplicationsGroupedByStage(user.tenantId, jobId);
  }

  @Get('app/applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Application 360 overview for a candidate' })
  async getApplication360(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.applicationsService.getApplication360(user.tenantId, applicationId);
  }

  @Patch('app/applications/:id/stage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Move candidate application stage with optimistic concurrency check' })
  @ApiResponse({ status: 200, description: 'Stage updated and stage history recorded' })
  @ApiResponse({ status: 409, description: 'Version conflict - application modified concurrently' })
  async moveStage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
    @Body() dto: MoveStageDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.applicationsService.moveStage(user.tenantId, applicationId, user, dto);
  }

  @Post('app/applications/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject an application with documented reason' })
  async rejectApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
    @Body() dto: RejectApplicationDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.applicationsService.rejectApplication(user.tenantId, applicationId, user, dto);
  }

  @Post('app/applications/:id/hire')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark an applicant as hired' })
  async markHired(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.applicationsService.markHired(user.tenantId, applicationId, user);
  }

  @Post('app/applications/bulk/move')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk move candidates across pipeline stages' })
  async bulkMove(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: BulkMoveDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.applicationsService.bulkMove(user.tenantId, user, dto);
  }

  @Post('app/applications/bulk/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk reject candidates with notification reason' })
  async bulkReject(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: BulkRejectDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.applicationsService.bulkReject(user.tenantId, user, dto);
  }
}
