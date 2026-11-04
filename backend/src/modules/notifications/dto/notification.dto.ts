import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class MarkReadDto {
  @ApiProperty({ example: ['notif-uuid-1', 'notif-uuid-2'], required: false })
  @IsOptional()
  @IsArray()
  notificationIds?: string[];
}

export class NotificationPreferencesDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  emailAlerts?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  applicationUpdates?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  marketingDigest?: boolean;
}
