import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload-product')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async uploadProduct(@Body() body: any) {
    return this.productService.uploadProduct(body);
  }

  @Get('get-product')
  async getAllProduct() {
    return this.productService.getAllProducts();
  }

  @Post('update-product')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateProduct(@Body() body: any) {
    return this.productService.updateProduct(body);
  }

  @Post('delete-admin-product')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteProduct(@Body('_id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Get('get-categoryProduct')
  async getCategoryProduct() {
    return this.productService.getCategoryProductOne();
  }

  @Post('category-product')
  async getCategoryWiseProduct(@Body('category') category: string) {
    return this.productService.getCategoryWiseProduct(category);
  }

  @Post('product-details')
  async getProductDetails(@Body('productId') productId: string) {
    return this.productService.getProductDetails(productId);
  }

  @Get('search')
  async searchProduct(@Query('q') query: string) {
    return this.productService.searchProduct(query);
  }

  @Post('filter-product')
  async filterProduct(@Body('category') category: string[]) {
    return this.productService.filterProduct(category);
  }
}
