import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const stripeKey =
      this.configService.get<string>('STRIPE_SECRET_KEY') ||
      'sk_test_51AfuGiDLpBCNMpv7o1gBzowirdnxb0KiXeRskD70ByH6oLKcIXnqOWlKsBFsOzBKQ6LHfsatlerkQkEGbeYok2AL006REg6cU1';
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia' as any,
    });
  }

  async createCheckoutSession(userId: string, cartItems: any[]) {
    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL')?.split(',')[0] ||
      'http://localhost:3000';

    const lineItems = cartItems.map((item) => {
      const prod = item.product || item.productId || item;
      const price = Number(prod.sellingPrice ?? prod.price ?? 1);
      const unitAmount = Math.max(50, Math.round(price * 100));
      const img = Array.isArray(prod?.productImage) && prod.productImage[0]
        ? prod.productImage[0]
        : (typeof prod?.productImage === 'string' ? prod.productImage : undefined);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: prod.productName || 'Product',
            images: img ? [img] : [],
            metadata: {
              productId: prod._id || prod.id || '',
            },
          },
          unit_amount: unitAmount,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: Number(item.quantity || 1),
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: lineItems,
      success_url: `${frontendUrl}/success`,
      cancel_url: `${frontendUrl}/cancel`,
    });

    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, curr) => {
      const prod = curr.product || curr.productId || curr;
      const price = Number(prod.sellingPrice ?? prod.price ?? 0);
      return acc + (price * Number(curr.quantity || 1));
    }, 0);

    // Persist the real order in PostgreSQL
    const orderItems = cartItems.map((item) => {
      const prod = item.product || item.productId || item;
      return {
        productId: prod._id || prod.id,
        productName: prod.productName || 'Product',
        brandName: prod.brandName || '',
        category: prod.category || '',
        productImage: Array.isArray(prod.productImage) ? prod.productImage : [prod.productImage].filter(Boolean),
        price: Number(prod.sellingPrice ?? prod.price ?? 0),
        quantity: Number(item.quantity || 1),
      };
    });

    await this.prisma.order.create({
      data: {
        userId: user.id,
        items: orderItems,
        totalAmount,
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.PROCESSING,
        stripeSessionId: session.id,
      },
    });

    // Clear cart items for this user
    await this.prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return {
      id: session.id,
      url: session.url,
      success: true,
      error: false,
    };
  }

  async getMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'User orders',
      data: orders.map((o) => ({
        ...o,
        _id: o.id,
        amount: o.totalAmount,
        totalAmount: o.totalAmount,
      })),
      success: true,
      error: false,
    };
  }

  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'All orders',
      data: orders.map((o) => ({
        ...o,
        _id: o.id,
        amount: o.totalAmount,
        totalAmount: o.totalAmount,
      })),
      success: true,
      error: false,
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
    });

    return {
      message: 'Order status updated',
      data: {
        ...updated,
        _id: updated.id,
      },
      success: true,
      error: false,
    };
  }
}
