import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import {
  CreateInterviewDto,
  SubmitScorecardDto,
  CreateAssessmentDto,
  InviteAssessmentDto,
  SaveAnswerDto,
} from './dto/interview.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Interviews & Assessments')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  // Employer Interviews
  @Get('app/interviews')
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List company interviews (ATS)' })
  async getTenantInterviews(@CurrentUser() user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.getTenantInterviews(user.tenantId);
  }

  @Post('app/interviews')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Schedule an interview for an application (ATS)' })
  async createInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateInterviewDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.createInterview(user.tenantId, dto);
  }

  @Post('app/interviews/:id/cancel')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cancel a scheduled interview' })
  async cancelInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') interviewId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.cancelInterview(user.tenantId, interviewId);
  }

  @Post('app/interviews/:id/scorecards')
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Submit interview scorecard evaluation' })
  async submitScorecard(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') interviewId: string,
    @Body() dto: SubmitScorecardDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.submitScorecard(user.tenantId, interviewId, user.userId, dto);
  }

  @Get('app/applications/:id/scorecards')
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get aggregated scorecards for an application' })
  async getApplicationScorecards(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.getApplicationScorecards(user.tenantId, applicationId);
  }

  // Candidate Interviews
  @Get('me/interviews')
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List candidate scheduled interviews' })
  async getCandidateInterviews(@CurrentUser() user: AuthenticatedUser) {
    return this.interviewsService.getCandidateInterviews(user.userId);
  }

  // Employer Assessments
  @Get('app/assessments')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List company assessment tests' })
  async getAssessments(@CurrentUser() user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.getTenantAssessments(user.tenantId);
  }

  @Post('app/assessments')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new skills assessment' })
  async createAssessment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAssessmentDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.createAssessment(user.tenantId, dto);
  }

  @Post('app/assessments/:id/invite')
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Invite an applicant to complete an assessment' })
  async inviteToAssessment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') assessmentId: string,
    @Body() dto: InviteAssessmentDto,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.inviteToAssessment(user.tenantId, assessmentId, dto);
  }

  @Get('app/assessments/:id/results')
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'View candidate results table for an assessment' })
  async getAssessmentResults(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') assessmentId: string,
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.interviewsService.getAssessmentResults(user.tenantId, assessmentId);
  }

  // Candidate Assessment Taking
  @Get('me/assessments')
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get candidate pending skills tests' })
  async getMyAssessments(@CurrentUser() user: AuthenticatedUser) {
    return this.interviewsService.getCandidatePendingAssessments(user.userId);
  }

  @Post('attempts/:inviteId/start')
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Start assessment attempt and start server timer' })
  async startAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('inviteId') inviteId: string,
  ) {
    return this.interviewsService.startAttempt(user.userId, inviteId);
  }

  @Put('attempts/:id/answers/:qid')
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Autosave an answer for a specific question' })
  async saveAnswer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') attemptId: string,
    @Param('qid') questionId: string,
    @Body() dto: SaveAnswerDto,
  ) {
    return this.interviewsService.saveAttemptAnswer(user.userId, attemptId, questionId, dto);
  }

  @Post('attempts/:id/submit')
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Final submit assessment attempt for grading' })
  async submitAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') attemptId: string,
  ) {
    return this.interviewsService.submitAttempt(user.userId, attemptId);
  }
}
