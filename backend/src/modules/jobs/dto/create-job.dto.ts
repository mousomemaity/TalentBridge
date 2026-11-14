import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { JobType, WorkplaceType, JobStatus } from '../../../common/constants/roles.enum';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Backend Engineer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'senior-backend-engineer', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'Engineering', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'Remote - US', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: JobType.FULL_TIME, enum: JobType })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({ example: WorkplaceType.REMOTE, enum: WorkplaceType })
  @IsEnum(WorkplaceType)
  workplaceType: WorkplaceType;

  @ApiProperty({ example: 140000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiProperty({ example: 180000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 'We are seeking an experienced Backend Engineer to scale our core platforms.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ['5+ years Node.js/TypeScript', 'Microservices design', 'MongoDB/Postgres experience'], required: false })
  @IsOptional()
  @IsArray()
  requirements?: string[];

  @ApiProperty({ example: ['TypeScript', 'NestJS', 'MongoDB', 'Docker', 'Redis'], required: false })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiProperty({ example: ['Health, Dental, Vision', '401k match', 'Unlimited PTO'], required: false })
  @IsOptional()
  @IsArray()
  benefits?: string[];

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  openings?: number;

  @ApiProperty({
    example: [
      { question: 'How many years of TypeScript experience do you have?', type: 'NUMBER', required: true, isKnockout: false },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  screeningQuestions?: any[];
}

export class UpdateJobDto {
  @ApiProperty({ example: 'Staff Backend Engineer', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Platform Engineering', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'New York, NY', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ enum: JobType, required: false })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiProperty({ enum: WorkplaceType, required: false })
  @IsOptional()
  @IsEnum(WorkplaceType)
  workplaceType?: WorkplaceType;

  @ApiProperty({ example: 150000, required: false })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiProperty({ example: 190000, required: false })
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  requirements?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  benefits?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  openings?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  screeningQuestions?: any[];
}

export class JobSearchQueryDto {
  @ApiProperty({ required: false, description: 'Search keywords (title, skills, description)' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, description: 'Location filter' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, enum: WorkplaceType })
  @IsOptional()
  @IsEnum(WorkplaceType)
  workplaceType?: WorkplaceType;

  @ApiProperty({ required: false, enum: JobType })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiProperty({ required: false, description: 'Department filter' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  page?: string = '1';

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  limit?: string = '20';
}
