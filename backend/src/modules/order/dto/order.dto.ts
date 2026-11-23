import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({
    description: 'Array of cart items to purchase with Stripe',
    example: [
      {
        productId: {
          productName: 'AirPods Max',
          sellingPrice: 479,
          productImage: ['https://res.cloudinary.com/.../img.jpg'],
        },
        quantity: 1,
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  cartItems: any[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'clx...order123', description: 'Order ID' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.SHIPPED,
    description: 'Updated order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)',
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
