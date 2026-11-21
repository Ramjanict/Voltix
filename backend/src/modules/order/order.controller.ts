import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrderStatus, Role } from '@prisma/client';

@Controller()
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  async checkout(
    @CurrentUser('id') userId: string,
    @Body('cartItems') cartItems: any[],
  ) {
    return this.orderService.createCheckoutSession(userId, cartItems);
  }

  @Get('order/my-orders')
  async getMyOrders(@CurrentUser('id') userId: string) {
    return this.orderService.getMyOrders(userId);
  }

  @Get('order/all-orders')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Post('order/update-status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateOrderStatus(
    @Body('orderId') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(orderId, status);
  }
}
