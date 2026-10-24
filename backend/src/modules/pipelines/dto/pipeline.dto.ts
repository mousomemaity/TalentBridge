import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { StageKind } from '../../../common/constants/roles.enum';

export class CreatePipelineTemplateDto {
  @ApiProperty({ example: 'Engineering Technical Pipeline' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: [
      { name: 'Applied', kind: StageKind.APPLIED, position: 0, slaDays: 3 },
      { name: 'Technical Assessment', kind: StageKind.SCREEN, position: 1, slaDays: 3 },
      { name: 'System Design Interview', kind: StageKind.INTERVIEW, position: 2, slaDays: 5 },
      { name: 'Executive Offer', kind: StageKind.OFFER, position: 3, slaDays: 3 },
      { name: 'Hired', kind: StageKind.HIRED, position: 4, slaDays: 0 },
      { name: 'Rejected', kind: StageKind.REJECTED, position: 5, slaDays: 0 },
    ],
  })
  @IsArray()
  stages: Array<{ name: string; kind: StageKind; position: number; slaDays?: number }>;
}

export class AddJobStageDto {
  @ApiProperty({ example: 'Technical Screen' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: StageKind.SCREEN, enum: StageKind })
  @IsEnum(StageKind)
  kind: StageKind;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  slaDays?: number;
}

export class UpdateJobStageDto {
  @ApiProperty({ example: 'Final Interview Panel', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  slaDays?: number;
}

export class ReorderStagesDto {
  @ApiProperty({
    example: [
      { stageId: 'stage-1', position: 0 },
      { stageId: 'stage-2', position: 1 },
    ],
  })
  @IsArray()
  orders: Array<{ stageId: string; position: number }>;
}
