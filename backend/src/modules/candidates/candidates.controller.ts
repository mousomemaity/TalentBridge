import {
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import {
  UpdateProfileDto,
  AddExperienceDto,
  AddEducationDto,
  UpdateSkillsDto,
  UpdatePreferencesDto,
  UpdateVisibilityDto,
} from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Candidate Portal')
@Controller('me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current logged-in candidate profile' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.candidatesService.getProfileByUserId(user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update candidate headline, summary, location, experience years' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.candidatesService.updateProfile(user.userId, dto);
  }

  @Post('experiences')
  @ApiOperation({ summary: 'Add an employment experience' })
  async addExperience(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddExperienceDto,
  ) {
    return this.candidatesService.addExperience(user.userId, dto);
  }

  @Delete('experiences/:id')
  @ApiOperation({ summary: 'Remove an employment experience' })
  async deleteExperience(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') expId: string,
  ) {
    return this.candidatesService.deleteExperience(user.userId, expId);
  }

  @Post('educations')
  @ApiOperation({ summary: 'Add education credentials' })
  async addEducation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddEducationDto,
  ) {
    return this.candidatesService.addEducation(user.userId, dto);
  }

  @Put('skills')
  @ApiOperation({ summary: 'Replace/update candidate skills list' })
  async updateSkills(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSkillsDto,
  ) {
    return this.candidatesService.updateSkills(user.userId, dto);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update job preferences (desired roles, locations, salary, remote)' })
  async updatePreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.candidatesService.updatePreferences(user.userId, dto);
  }

  @Patch('visibility')
  @ApiOperation({ summary: 'Update candidate profile visibility and company blocklist' })
  async updateVisibility(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateVisibilityDto,
  ) {
    return this.candidatesService.updateVisibility(user.userId, dto);
  }
}
