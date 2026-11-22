import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: string, productId: string) {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      return {
        message: 'Already exits in Add to cart',
        success: true,
        error: false,
        data: {
          ...existing,
          _id: existing.id,
        },
      };
    }

    const newCartItem = await this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity: 1,
      },
    });

    return {
      message: 'Product Added in Cart',
      data: {
        ...newCartItem,
        _id: newCartItem.id,
      },
      success: true,
      error: false,
    };
  }

  async countAddToCart(userId: string) {
    const count = await this.prisma.cartItem.count({
      where: { userId },
    });

    return {
      data: { count },
      message: 'ok',
      error: false,
      success: true,
    };
  }

  async viewCardProduct(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = items
      .filter((item) => item.product !== null)
      .map((item) => {
        const prod = {
          ...item.product,
          _id: item.product.id,
        };

        return {
          _id: item.id,
          id: item.id,
          userId: item.userId,
          quantity: item.quantity,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          productId: prod,
          product: prod,
        };
      });

    return {
      data: formatted,
      success: true,
      error: false,
    };
  }

  async updateCartProduct(id: string, quantity: number) {
    if (!id) {
      throw new BadRequestException('Cart Item ID is required');
    }

    const updated = await this.prisma.cartItem.update({
      where: { id },
      data: {
        quantity: Number(quantity),
      },
    });

    return {
      data: {
        ...updated,
        _id: updated.id,
      },
      message: 'product update',
      success: true,
      error: false,
    };
  }

  async deleteCartProduct(id: string) {
    if (!id) {
      throw new BadRequestException('Cart Item ID is required');
    }

    const deleted = await this.prisma.cartItem.delete({
      where: { id },
    });

    return {
      data: {
        ...deleted,
        _id: deleted.id,
      },
      message: 'product delete',
      success: true,
      error: false,
    };
  }
}
