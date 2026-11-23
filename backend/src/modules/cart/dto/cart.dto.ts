import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'clx...product123', description: 'Product ID to add to cart' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class UpdateCartProductDto {
  @ApiProperty({ example: 'clx...cartItem123', description: 'Cart item ID' })
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty({ example: 2, description: 'New quantity for the cart item', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class DeleteCartProductDto {
  @ApiProperty({ example: 'clx...cartItem123', description: 'Cart item ID to remove' })
  @IsNotEmpty()
  @IsString()
  _id: string;
}
