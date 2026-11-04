import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({ example: 'file-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @ApiProperty({ example: 'alex_morgan_resume.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'https://storage.talentbridge.io/resumes/file-uuid-1234.pdf' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ example: 'application/pdf', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ example: 245000, required: false })
  @IsOptional()
  @IsNumber()
  sizeBytes?: number;
}

export class PresignFileDto {
  @ApiProperty({ example: 'resume.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ example: 'RESUME', enum: ['RESUME', 'AVATAR', 'DOCUMENT', 'LOGO'] })
  @IsString()
  category: string;
}
