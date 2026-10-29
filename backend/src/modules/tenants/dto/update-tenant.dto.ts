import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../common/constants/roles.enum';

export class UpdateTenantDto {
  @ApiProperty({ example: 'Acme Technologies Inc.', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'https://cdn.example.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ example: 'acme.com', required: false })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({ example: { bio: 'Innovating HRTech', primaryColor: '#2563eb' }, required: false })
  @IsOptional()
  settings?: Record<string, any>;
}

export class InviteMemberDto {
  @ApiProperty({ example: 'colleague@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'RECRUITER', enum: [UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN] })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'Engineering', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'Jane', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class UpdateMemberDto {
  @ApiProperty({ example: 'HIRING_MANAGER', enum: [UserRole.RECRUITER, UserRole.HIRING_MANAGER, UserRole.COMPANY_ADMIN], required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: 'Design', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isActive?: boolean;
}
