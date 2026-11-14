import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PipelinesService } from './pipelines.service';
import {
  CreatePipelineTemplateDto,
  AddJobStageDto,
  UpdateJobStageDto,
  ReorderStagesDto,
} from './dto/pipeline.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Pipelines & Stages')
@Controller('app')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get('pipeline-templates')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List reusable ATS pipeline templates' })
  async getTemplates(@CurrentUser() user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.pipelinesService.getTemplates(user.tenantId);
  }

  @Post('pipeline-templates')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new pipeline template' })
  async createTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePipelineTemplateDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.pipelinesService.createTemplate(user.tenantId, dto);
  }

  @Patch('pipeline-templates/:id')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an existing pipeline template' })
  async updateTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') templateId: string,
    @Body() dto: Partial<CreatePipelineTemplateDto>,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.pipelinesService.updateTemplate(user.tenantId, templateId, dto);
  }

  @Post('jobs/:id/stages')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add a customized stage to a job pipeline' })
  async addStage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
    @Body() dto: AddJobStageDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.pipelinesService.addStageToJob(user.tenantId, jobId, dto);
  }

  @Patch('stages/:id')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rename stage or modify SLA days' })
  async updateStage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') stageId: string,
    @Body() dto: UpdateJobStageDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.pipelinesService.updateJobStage(user.tenantId, stageId, dto);
  }

  @Put('jobs/:id/stages/order')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reorder stages in a job pipeline' })
  async reorderStages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
    @Body() dto: ReorderStagesDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.pipelinesService.reorderJobStages(user.tenantId, jobId, dto);
  }
}
