import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../common/constants/roles.enum';

@ApiTags('Resumes')
@Controller('me/resumes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CANDIDATE, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  @ApiOperation({ summary: 'List candidate uploaded resumes' })
  async getResumes(@CurrentUser() user: AuthenticatedUser) {
    return this.resumesService.getResumes(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Register uploaded resume after client upload' })
  async createResume(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateResumeDto,
  ) {
    return this.resumesService.createResume(user.userId, dto);
  }

  @Post(':id/parse')
  @ApiOperation({ summary: 'Trigger AI parse for a specific resume' })
  async parseResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') resumeId: string,
  ) {
    return this.resumesService.parseResume(user.userId, resumeId);
  }

  @Get(':id/parsed')
  @ApiOperation({ summary: 'Get parsed resume structured data for review' })
  async getParsedResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') resumeId: string,
  ) {
    return this.resumesService.getParsedResume(user.userId, resumeId);
  }

  @Post(':id/apply-parsed')
  @ApiOperation({ summary: 'Merge parsed resume fields into candidate profile' })
  async applyParsedData(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') resumeId: string,
  ) {
    return this.resumesService.applyParsedData(user.userId, resumeId);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set resume as candidate default' })
  async setDefaultResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') resumeId: string,
  ) {
    return this.resumesService.setDefaultResume(user.userId, resumeId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resume' })
  async deleteResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') resumeId: string,
  ) {
    return this.resumesService.deleteResume(user.userId, resumeId);
  }
}
