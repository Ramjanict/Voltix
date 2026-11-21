import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('addtocart')
  async addToCart(
    @CurrentUser('id') userId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartService.addToCart(userId, productId);
  }

  @Get('countAddToCart')
  async countAddToCart(@CurrentUser('id') userId: string) {
    return this.cartService.countAddToCart(userId);
  }

  @Get('view-card-product')
  async viewCardProduct(@CurrentUser('id') userId: string) {
    return this.cartService.viewCardProduct(userId);
  }

  @Post('update-cart-product')
  async updateCartProduct(
    @Body('_id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateCartProduct(id, quantity);
  }

  @Post('delete-cart-product')
  async deleteCartProduct(@Body('_id') id: string) {
    return this.cartService.deleteCartProduct(id);
  }
}
