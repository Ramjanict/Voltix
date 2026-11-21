import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Please provide your name' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Please provide your email' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Please provide your password' })
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  password: string;

  @IsOptional()
  @IsString()
  profilePic?: string;
}

export class SignInDto {
  @IsNotEmpty({ message: 'Please provide your email' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Please provide your password' })
  password: string;
}
