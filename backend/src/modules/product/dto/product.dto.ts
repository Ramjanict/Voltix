import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UploadProductDto {
  @ApiProperty({ example: 'AirPods Max', description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({ example: 'Apple', description: 'Brand name' })
  @IsNotEmpty()
  @IsString()
  brandName: string;

  @ApiProperty({ example: 'earphones', description: 'Product category' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: ['https://res.cloudinary.com/.../img1.jpg'],
    description: 'Array of image URLs',
    type: [String],
  })
  @IsArray()
  productImage: string[];

  @ApiPropertyOptional({ example: 'Premium high-fidelity audio headphones', description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 549, description: 'Original retail price' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 479, description: 'Discounted selling price' })
  @IsNotEmpty()
  @IsNumber()
  sellingPrice: number;

  @ApiPropertyOptional({ example: 50, description: 'Available stock quantity', default: 100 })
  @IsOptional()
  @IsNumber()
  stock?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'clx...product123', description: 'Product ID' })
  @IsOptional()
  @IsString()
  _id?: string;

  @ApiPropertyOptional({ example: 'clx...product123', description: 'Alternative Product ID field' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: 'AirPods Max 2' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ example: 'Apple' })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional({ example: 'earphones' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  productImage?: string[];

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 599 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 499 })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsNumber()
  stock?: number;
}

export class DeleteProductDto {
  @ApiProperty({ example: 'clx...product123', description: 'Product ID to delete' })
  @IsNotEmpty()
  @IsString()
  _id: string;
}

export class CategoryWiseProductDto {
  @ApiProperty({ example: 'mobiles', description: 'Category name to fetch products for' })
  @IsNotEmpty()
  @IsString()
  category: string;
}

export class ProductDetailsDto {
  @ApiProperty({ example: 'clx...product123', description: 'Target product ID' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class FilterProductDto {
  @ApiProperty({
    example: ['mobiles', 'watches'],
    description: 'Array of categories to filter products by',
    type: [String],
  })
  @IsArray()
  category: string[];
}
