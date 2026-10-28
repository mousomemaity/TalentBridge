import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ApplyJobDto {
  @ApiProperty({ example: 'resume-uuid-1234', required: false })
  @IsOptional()
  @IsString()
  resumeId?: string;

  @ApiProperty({ example: 'I am excited to apply for this role because of my deep background in distributed systems...', required: false })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty({ example: { experienceYears: 5, authorizedToWork: true }, required: false })
  @IsOptional()
  screeningAnswers?: Record<string, any>;
}

export class MoveStageDto {
  @ApiProperty({ example: 'stage-uuid-5678', description: 'Target stage ID' })
  @IsString()
  @IsNotEmpty()
  stageId: string;

  @ApiProperty({ example: 1, description: 'Current version for optimistic locking' })
  @IsNumber()
  version: number;

  @ApiProperty({ example: 'Advanced after technical screening interview', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class RejectApplicationDto {
  @ApiProperty({ example: 'Position filled by another candidate' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class AddApplicationNoteDto {
  @ApiProperty({ example: 'Candidate demonstrated outstanding system design skills during architecture review.' })
  @IsString()
  @IsNotEmpty()
  note: string;
}

export class BulkMoveDto {
  @ApiProperty({ example: ['app-id-1', 'app-id-2'] })
  @IsArray()
  applicationIds: string[];

  @ApiProperty({ example: 'stage-uuid-5678' })
  @IsString()
  @IsNotEmpty()
  stageId: string;
}

export class BulkRejectDto {
  @ApiProperty({ example: ['app-id-1', 'app-id-2'] })
  @IsArray()
  applicationIds: string[];

  @ApiProperty({ example: 'Role requirements updated' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
