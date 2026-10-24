import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateInterviewDto {
  @ApiProperty({ example: 'app-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ example: ['recruiter-user-id'] })
  @IsArray()
  interviewerIds: string[];

  @ApiProperty({ example: 'VIDEO', enum: ['PHONE', 'VIDEO', 'ONSITE'] })
  @IsString()
  type: string;

  @ApiProperty({ example: '2026-11-01T14:00:00Z' })
  @IsDateString()
  startsAt: string;

  @ApiProperty({ example: '2026-11-01T15:00:00Z' })
  @IsDateString()
  endsAt: string;

  @ApiProperty({ example: 'America/New_York', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ example: 'Architecture and technical deep-dive', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SubmitScorecardDto {
  @ApiProperty({
    example: [
      { criterion: 'System Design', score: 5, notes: 'Clear understanding of event-driven patterns' },
      { criterion: 'Communication', score: 4, notes: 'Articulate and structured' },
    ],
  })
  @IsArray()
  ratings: Array<{ criterion: string; score: number; notes?: string }>;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  overallRating: number;

  @ApiProperty({ example: 'STRONG_YES', enum: ['STRONG_YES', 'YES', 'NEUTRAL', 'NO', 'STRONG_NO'] })
  @IsString()
  recommendation: string;

  @ApiProperty({ example: 'Exceptional candidate, recommend moving to offer stage immediately.' })
  @IsOptional()
  @IsString()
  summary?: string;
}

export class CreateAssessmentDto {
  @ApiProperty({ example: 'TypeScript & Distributed Systems Evaluation' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '45-minute timed technical assessment' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 45 })
  @IsNumber()
  durationMinutes: number;

  @ApiProperty({ example: 70 })
  @IsNumber()
  passScore: number;

  @ApiProperty({
    example: [
      { prompt: 'What is the primary difference between Promise.all and Promise.allSettled?', type: 'MCQ', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B', points: 10 },
    ],
  })
  @IsArray()
  questions: any[];
}

export class InviteAssessmentDto {
  @ApiProperty({ example: 'app-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;
}

export class SaveAnswerDto {
  @ApiProperty({ example: 'B' })
  @IsNotEmpty()
  answer: any;
}
