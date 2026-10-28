import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import {
  GenerateJobDescriptionDto,
  BiasCheckDto,
  ExplainMatchQueryDto,
  AnalyzeResumeDto,
  ParseResumeTextDto,
  GenerateInterviewQuestionsDto,
} from './dto/ai.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('AI & Matching')
@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('me/recommended-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI recommended jobs matched to candidate profile' })
  async getRecommendedJobs(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit = '10',
  ) {
    return this.aiService.getRecommendedJobs(user.userId, Number(limit));
  }

  @Get('app/jobs/:id/recommended-candidates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI recommended candidates matched to job requirements' })
  async getRecommendedCandidates(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
    @Query('limit') limit = '10',
  ) {
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    return this.aiService.getRecommendedCandidates(user.tenantId, jobId, Number(limit));
  }

  @Get('matching/explain')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get explainable match score breakdown for a candidate and job pair' })
  async explainMatch(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ExplainMatchQueryDto,
  ) {
    const candidateId = query.candidateId || user.userId;
    return this.aiService.explainMatch(candidateId, query.jobId);
  }

  @Post('me/resume/analyze')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Analyze candidate profile and resume for strengths and gaps' })
  async analyzeMyResume(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AnalyzeResumeDto,
  ) {
    return this.aiService.analyzeResume(user.userId, dto);
  }

  @Post('me/resume/parse-text')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Parse text into candidate profile schema' })
  async parseResumeText(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ParseResumeTextDto,
  ) {
    return this.aiService.parseResumeText(dto.text);
  }

  @Post('app/jobs/ai/generate-description')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate job description draft using AI' })
  async generateJobDescription(@Body() dto: GenerateJobDescriptionDto) {
    return this.aiService.generateJobDescription(dto);
  }

  @Post('app/jobs/ai/bias-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check job requisition text for exclusionary or biased language' })
  async checkBias(@Body() dto: BiasCheckDto) {
    return this.aiService.checkBias(dto);
  }

  @Post('app/jobs/ai/interview-questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate structured interview question suggestions for job' })
  async generateInterviewQuestions(@Body() dto: GenerateInterviewQuestionsDto) {
    return this.aiService.generateInterviewQuestions(dto);
  }

  @Get('app/candidates/:id/ai-summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate objective candidate summary for authorized recruiters' })
  async getCandidateRecruiterSummary(@Param('id') candidateId: string) {
    return this.aiService.generateCandidateRecruiterSummary(candidateId);
  }
}
