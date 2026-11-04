import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsNumber } from 'class-validator';

export class GenerateJobDescriptionDto {
  @ApiProperty({ example: 'Staff Backend Architect' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'FinTech', required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ example: 'Senior', required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ example: 'Kafka, Go, TypeScript, Event-driven systems', required: false })
  @IsOptional()
  @IsString()
  keySkills?: string;
}

export class BiasCheckDto {
  @ApiProperty({ example: 'We are looking for a rockstar ninja developer who is aggressive in problem solving.' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class ExplainMatchQueryDto {
  @ApiProperty({ example: 'job-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({ example: 'candidate-user-uuid-5678', required: false })
  @IsOptional()
  @IsString()
  candidateId?: string;
}

export class AnalyzeResumeDto {
  @ApiProperty({ example: 'Senior Full Stack Engineer', required: false })
  @IsOptional()
  @IsString()
  targetRole?: string;
}

export class ParseResumeTextDto {
  @ApiProperty({ example: 'John Doe\nSoftware Engineer\nSkills: TypeScript, NestJS...' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class GenerateInterviewQuestionsDto {
  @ApiProperty({ example: 'Backend Architect' })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ example: ['TypeScript', 'Kubernetes', 'MongoDB'], required: false })
  @IsOptional()
  @IsArray()
  skills?: string[];
}

export class CandidateRecruiterSummaryDto {
  @ApiProperty({ example: 'candidate-user-uuid-5678' })
  @IsString()
  @IsNotEmpty()
  candidateId: string;
}
