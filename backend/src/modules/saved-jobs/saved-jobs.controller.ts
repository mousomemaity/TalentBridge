import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SavedJobsService } from './saved-jobs.service';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Saved Jobs & Alerts')
@Controller('me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Get('saved-jobs')
  @ApiOperation({ summary: 'List candidate saved jobs' })
  async getSavedJobs(@CurrentUser() user: AuthenticatedUser) {
    return this.savedJobsService.getSavedJobs(user.userId);
  }

  @Post('saved-jobs/:jobId')
  @ApiOperation({ summary: 'Save a job to candidate favorites (enforces uniqueness)' })
  async saveJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('jobId') jobId: string,
  ) {
    return this.savedJobsService.saveJob(user.userId, jobId);
  }

  @Delete('saved-jobs/:jobId')
  @ApiOperation({ summary: 'Remove a job from candidate saved jobs' })
  async unsaveJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('jobId') jobId: string,
  ) {
    return this.savedJobsService.unsaveJob(user.userId, jobId);
  }

  @Get('saved-searches')
  @ApiOperation({ summary: 'List candidate saved searches and job alerts' })
  async getSavedSearches(@CurrentUser() user: AuthenticatedUser) {
    return this.savedJobsService.getSavedSearches(user.userId);
  }

  @Post('saved-searches')
  @ApiOperation({ summary: 'Create a saved search / email job alert' })
  async createSavedSearch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSavedSearchDto,
  ) {
    return this.savedJobsService.createSavedSearch(user.userId, dto);
  }

  @Delete('saved-searches/:id')
  @ApiOperation({ summary: 'Delete a saved search / alert' })
  async deleteSavedSearch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') searchId: string,
  ) {
    return this.savedJobsService.deleteSavedSearch(user.userId, searchId);
  }
}
