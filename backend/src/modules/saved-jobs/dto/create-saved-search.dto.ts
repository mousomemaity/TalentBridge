import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSavedSearchDto {
  @ApiProperty({ example: 'Remote React Jobs' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'React TypeScript', required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ example: { workplaceType: 'REMOTE', jobType: 'FULL_TIME' }, required: false })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiProperty({ example: 'DAILY', enum: ['DAILY', 'WEEKLY'], required: false })
  @IsOptional()
  @IsString()
  frequency?: string;
}
