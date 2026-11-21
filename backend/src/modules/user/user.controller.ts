import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all-users')
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('update-user')
  @Roles(Role.ADMIN)
  async updateUser(@Body() body: any) {
    return this.userService.updateUser(body);
  }
}
