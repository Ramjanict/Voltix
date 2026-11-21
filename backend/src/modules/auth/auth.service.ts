import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private formatUser(user: any) {
    if (!user) return null;
    const { password, ...rest } = user;
    return {
      ...rest,
      _id: user.id,
    };
  }

  async signUp(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new BadRequestException('Already user exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        profilePic: dto.profilePic || null,
        role: Role.GENERAL,
      },
    });

    return {
      message: 'User created Successfully!',
      success: true,
      error: false,
      data: this.formatUser(user),
    };
  }

  async signIn(dto: SignInDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new BadRequestException('User has not found correctly');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Please check the password');
    }

    const tokenPayload = {
      _id: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const secret =
      this.configService.get<string>('JWT_SECRET') ||
      this.configService.get<string>('TOKEN_SECRET_KEY');

    const token = await this.jwtService.signAsync(tokenPayload, {
      secret,
      expiresIn: '12h',
    });

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    });

    return {
      message: 'Login Successfully',
      data: token,
      user: this.formatUser(user),
      success: true,
      error: false,
    };
  }

  logout(res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return {
      message: 'User Logout Successfully!',
      data: [],
      success: true,
      error: false,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      message: 'User details',
      data: this.formatUser(user),
      success: true,
      error: false,
    };
  }
}
