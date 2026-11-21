import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private formatUser(user: any) {
    if (!user) return null;
    const { password, ...rest } = user;
    return {
      ...rest,
      _id: user.id,
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'All user',
      data: users.map((u) => this.formatUser(u)),
      success: true,
      error: false,
    };
  }

  async updateUser(dto: {
    userId?: string;
    _id?: string;
    role?: Role;
    name?: string;
    email?: string;
  }) {
    const targetId = dto.userId || dto._id;
    if (!targetId) {
      throw new BadRequestException('Target user ID is required');
    }

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: {
        ...(dto.role && { role: dto.role }),
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email.toLowerCase() }),
      },
    });

    return {
      message: 'Update user successfully',
      data: this.formatUser(updated),
      success: true,
      error: false,
    };
  }
}
