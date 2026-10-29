import {
  Controller,
  Get,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Reports & Audit')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('app/reports/funnel')
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get candidate conversion funnel analytics by stage' })
  async getFunnelReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query('jobId') jobId?: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.reportsService.getFunnelReport(user.tenantId, jobId);
  }

  @Get('app/reports/sources')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get candidate sourcing effectiveness report' })
  async getSourceReport(@CurrentUser() user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.reportsService.getSourceReport(user.tenantId);
  }

  @Get('app/reports/time-to-hire')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get average time-to-hire and time-in-stage analytics' })
  async getTimeToHireReport(@CurrentUser() user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.reportsService.getTimeToHireReport(user.tenantId);
  }

  @Get('audit-logs')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Query append-only audit logs for security and compliance' })
  async getAuditLogs(@CurrentUser() user: AuthenticatedUser) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    return this.reportsService.getAuditLogs(user.tenantId, isSuperAdmin);
  }
}
