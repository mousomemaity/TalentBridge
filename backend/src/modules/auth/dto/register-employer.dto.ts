import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterEmployerDto {
  @ApiProperty({ example: 'employer@acme.inc', description: 'Employer work email' })
  @IsEmail({}, { message: 'A valid email address is required' })
  email: string;

  @ApiProperty({ example: 'SecureEmpP@ss123', description: 'Password (min 8 characters)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'Sarah', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Connor', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Acme Corp', description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'acme-corp', required: false, description: 'Optional unique URL slug for company' })
  @IsOptional()
  @IsString()
  companySlug?: string;

  @ApiProperty({ example: 'acme.inc', required: false, description: 'Company primary domain' })
  @IsOptional()
  @IsString()
  domain?: string;
}
