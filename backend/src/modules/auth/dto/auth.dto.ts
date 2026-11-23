import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty({ message: 'Please provide your name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Valid email address' })
  @IsNotEmpty({ message: 'Please provide your email' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({ example: 'Secret1234', description: 'User password (min 4 characters)' })
  @IsNotEmpty({ message: 'Please provide your password' })
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  password: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/.../avatar.jpg',
    description: 'Cloudinary avatar URL',
  })
  @IsOptional()
  @IsString()
  profilePic?: string;
}

export class SignInDto {
  @ApiProperty({ example: 'user@example.com', description: 'User registered email' })
  @IsNotEmpty({ message: 'Please provide your email' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({ example: 'Secret1234', description: 'User password' })
  @IsNotEmpty({ message: 'Please provide your password' })
  password: string;
}
