import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Senior Full Stack Engineer', required: false })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiProperty({ example: 'Passionate developer with 6+ years of building web and mobile apps.', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ example: 'San Francisco, CA', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 6, required: false })
  @IsOptional()
  @IsNumber()
  yearsExperience?: number;
}

export class AddExperienceDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'New York, NY', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsString()
  startDate: string;

  @ApiProperty({ example: '2024-03-01', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @ApiProperty({ example: 'Led core platform microservices migration.', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddEducationDto {
  @ApiProperty({ example: 'University of California, Berkeley' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({ example: 'Bachelor of Science' })
  @IsString()
  @IsNotEmpty()
  degree: string;

  @ApiProperty({ example: 'Computer Science', required: false })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiProperty({ example: '2018-08-01' })
  @IsString()
  startDate: string;

  @ApiProperty({ example: '2022-05-01', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export class UpdateSkillsDto {
  @ApiProperty({
    example: [
      { name: 'TypeScript', level: 'EXPERT', yearsExperience: 5 },
      { name: 'React', level: 'ADVANCED', yearsExperience: 4 },
      { name: 'NestJS', level: 'ADVANCED', yearsExperience: 3 },
    ],
  })
  @IsArray()
  skills: Array<{ name: string; level?: string; yearsExperience?: number }>;
}

export class UpdatePreferencesDto {
  @ApiProperty({ example: ['Backend Engineer', 'Full Stack Engineer'], required: false })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @ApiProperty({ example: ['Remote', 'New York', 'San Francisco'], required: false })
  @IsOptional()
  @IsArray()
  locations?: string[];

  @ApiProperty({ example: 120000, required: false })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  remoteOnly?: boolean;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  noticePeriodDays?: number;
}

export class UpdateVisibilityDto {
  @ApiProperty({ example: 'PUBLIC', enum: ['PUBLIC', 'RECRUITERS_ONLY', 'HIDDEN'] })
  @IsString()
  visibility: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  openToWork?: boolean;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  blockedCompanyIds?: string[];
}
