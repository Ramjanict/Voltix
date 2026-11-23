import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { CheckoutDto, UpdateOrderStatusDto } from './dto/order.dto';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@ApiCookieAuth('token')
@Controller()
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Initiate Stripe Checkout session for cart items' })
  @ApiResponse({ status: 200, description: 'Stripe checkout session created with URL' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  async checkout(
    @CurrentUser('id') userId: string,
    @Body() dto: CheckoutDto,
  ) {
    return this.orderService.createCheckoutSession(userId, dto.cartItems);
  }

  @Get('order/my-orders')
  @ApiOperation({ summary: 'List order history for the currently logged-in user' })
  @ApiResponse({ status: 200, description: 'User order history' })
  async getMyOrders(@CurrentUser('id') userId: string) {
    return this.orderService.getMyOrders(userId);
  }

  @Get('order/all-orders')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all customer orders across platform (Admin only)' })
  @ApiResponse({ status: 200, description: 'All orders list' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Post('order/update-status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update shipping/fulfillment status of an order (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async updateOrderStatus(@Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(dto.orderId, dto.status);
  }
}
