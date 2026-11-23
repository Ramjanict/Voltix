import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiCookieAuth('token')
@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all-users')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all registered users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('update-user')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user role or details (Admin only)' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or missing user ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async updateUser(@Body() body: UpdateUserDto) {
    return this.userService.updateUser(body);
  }
}
