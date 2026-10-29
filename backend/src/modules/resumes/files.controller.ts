import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { PresignFileDto } from './dto/create-resume.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Files & Uploads')
@Controller('files')
export class FilesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('presign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtain presigned upload URL for resumes or documents' })
  async presign(@Body() dto: PresignFileDto) {
    return this.resumesService.presignUpload(dto);
  }
}
