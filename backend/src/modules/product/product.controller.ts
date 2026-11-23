import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  CategoryWiseProductDto,
  DeleteProductDto,
  FilterProductDto,
  ProductDetailsDto,
  UpdateProductDto,
  UploadProductDto,
} from './dto/product.dto';

@ApiTags('Products')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload-product')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Create and upload a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product uploaded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async uploadProduct(@Body() body: UploadProductDto) {
    return this.productService.uploadProduct(body);
  }

  @Get('get-product')
  @ApiOperation({ summary: 'Get all available products in catalog' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  async getAllProduct() {
    return this.productService.getAllProducts();
  }

  @Post('update-product')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Update an existing product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Product ID required' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async updateProduct(@Body() body: UpdateProductDto) {
    return this.productService.updateProduct(body);
  }

  @Post('delete-admin-product')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Delete a product from the catalog (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 400, description: 'Product ID required' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async deleteProduct(@Body() dto: DeleteProductDto) {
    return this.productService.deleteProduct(dto._id);
  }

  @Get('get-categoryProduct')
  @ApiOperation({ summary: 'Get one featured product for each distinct category' })
  @ApiResponse({ status: 200, description: 'List of 1 product per category' })
  async getCategoryProduct() {
    return this.productService.getCategoryProductOne();
  }

  @Post('category-product')
  @ApiOperation({ summary: 'Get all products belonging to a specified category' })
  @ApiResponse({ status: 200, description: 'List of products for the category' })
  async getCategoryWiseProduct(@Body() dto: CategoryWiseProductDto) {
    return this.productService.getCategoryWiseProduct(dto.category);
  }

  @Post('product-details')
  @ApiOperation({ summary: 'Get full details and specifications of a single product' })
  @ApiResponse({ status: 200, description: 'Product details object' })
  @ApiResponse({ status: 400, description: 'Product ID required' })
  async getProductDetails(@Body() dto: ProductDetailsDto) {
    return this.productService.getProductDetails(dto.productId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by query term (matches name, category, or brand)' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query keyword' })
  @ApiResponse({ status: 200, description: 'List of matching products' })
  async searchProduct(@Query('q') query: string) {
    return this.productService.searchProduct(query);
  }

  @Post('filter-product')
  @ApiOperation({ summary: 'Filter products by an array of category names' })
  @ApiResponse({ status: 200, description: 'Filtered product list' })
  async filterProduct(@Body() dto: FilterProductDto) {
    return this.productService.filterProduct(dto.category);
  }
}
