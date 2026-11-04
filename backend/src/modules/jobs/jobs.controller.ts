import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, JobSearchQueryDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole, JobStatus } from '../../common/constants/roles.enum';

@ApiTags('Jobs')
@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // Public Endpoints
  @Get('jobs')
  @ApiOperation({ summary: 'Search and filter published jobs (Public)' })
  async searchJobs(@Query() query: JobSearchQueryDto) {
    return this.jobsService.searchPublicJobs(query);
  }

  @Get('jobs/:slug')
  @ApiOperation({ summary: 'Get published job detail by unique slug (Public)' })
  async getJobBySlug(@Param('slug') slug: string) {
    return this.jobsService.getPublicJobBySlug(slug);
  }

  // Employer ATS Endpoints (/app/jobs)
  @Get('app/jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all jobs for employer company (ATS)' })
  async getTenantJobs(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: JobStatus,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.getTenantJobs(user.tenantId, status);
  }

  @Post('app/jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job draft (ATS)' })
  async createJob(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateJobDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.createJob(user.tenantId, dto, user.userId);
  }

  @Get('app/jobs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get internal job details and stages by ID (ATS)' })
  async getTenantJobById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.getTenantJobById(user.tenantId, jobId);
  }

  @Patch('app/jobs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job requisition details (ATS)' })
  async updateJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
    @Body() dto: UpdateJobDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.updateJob(user.tenantId, jobId, dto);
  }

  @Post('app/jobs/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish job requisition to public board (ATS)' })
  async publishJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.publishJob(user.tenantId, jobId);
  }

  @Post('app/jobs/:id/pause')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pause applications for a job (ATS)' })
  async pauseJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.pauseJob(user.tenantId, jobId);
  }

  @Post('app/jobs/:id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close a job requisition (ATS)' })
  async closeJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.closeJob(user.tenantId, jobId);
  }

  @Post('app/jobs/:id/duplicate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duplicate an existing job requisition (ATS)' })
  async duplicateJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.jobsService.duplicateJob(user.tenantId, jobId, user.userId);
  }
}
