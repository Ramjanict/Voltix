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
import { CartService } from './cart.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  AddToCartDto,
  DeleteCartProductDto,
  UpdateCartProductDto,
} from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@ApiCookieAuth('token')
@Controller()
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('addtocart')
  @ApiOperation({ summary: 'Add a product to user cart or increment quantity' })
  @ApiResponse({ status: 200, description: 'Product added to cart successfully' })
  async addToCart(
    @CurrentUser('id') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, dto.productId);
  }

  @Get('countAddToCart')
  @ApiOperation({ summary: 'Count total number of items in user cart' })
  @ApiResponse({ status: 200, description: 'Cart item count' })
  async countAddToCart(@CurrentUser('id') userId: string) {
    return this.cartService.countAddToCart(userId);
  }

  @Get('view-card-product')
  @ApiOperation({ summary: 'View all products currently in user cart with details' })
  @ApiResponse({ status: 200, description: 'List of cart items with populated product data' })
  async viewCardProduct(@CurrentUser('id') userId: string) {
    return this.cartService.viewCardProduct(userId);
  }

  @Post('update-cart-product')
  @ApiOperation({ summary: 'Update quantity of a product in user cart' })
  @ApiResponse({ status: 200, description: 'Cart item quantity updated' })
  async updateCartProduct(@Body() dto: UpdateCartProductDto) {
    return this.cartService.updateCartProduct(dto._id, dto.quantity);
  }

  @Post('delete-cart-product')
  @ApiOperation({ summary: 'Remove a product item from user cart' })
  @ApiResponse({ status: 200, description: 'Cart item deleted' })
  async deleteCartProduct(@Body() dto: DeleteCartProductDto) {
    return this.cartService.deleteCartProduct(dto._id);
  }
}
