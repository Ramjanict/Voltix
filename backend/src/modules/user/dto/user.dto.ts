import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'clx...123', description: 'ID of user to update' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: 'clx...123', description: 'Alternative alias for ID' })
  @IsOptional()
  @IsString()
  _id?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.ADMIN, description: 'User role (ADMIN or GENERAL)' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Updated user name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'jane@example.com', description: 'Updated user email' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
