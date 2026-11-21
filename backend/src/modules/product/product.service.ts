import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private formatProduct(p: any) {
    if (!p) return null;
    return {
      ...p,
      _id: p.id,
    };
  }

  async uploadProduct(body: any) {
    const product = await this.prisma.product.create({
      data: {
        productName: body.productName,
        brandName: body.brandName,
        category: body.category,
        productImage: Array.isArray(body.productImage) ? body.productImage : [],
        description: body.description || '',
        price: Number(body.price),
        sellingPrice: Number(body.sellingPrice),
        stock: body.stock !== undefined ? Number(body.stock) : 100,
      },
    });

    return {
      message: 'Product upload successfully',
      error: false,
      success: true,
      data: this.formatProduct(product),
    };
  }

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'All products available here',
      error: false,
      success: true,
      data: products.map((p) => this.formatProduct(p)),
    };
  }

  async updateProduct(body: any) {
    const productId = body._id || body.id;
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    const { _id, id, ...updateData } = body;
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.sellingPrice !== undefined)
      updateData.sellingPrice = Number(updateData.sellingPrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return {
      message: 'Product update successfully',
      error: false,
      success: true,
      data: this.formatProduct(updated),
    };
  }

  async deleteProduct(productId: string) {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    const deleted = await this.prisma.product.delete({
      where: { id: productId },
    });

    return {
      data: deleted,
      message: 'Admin product delete',
      success: true,
      error: false,
    };
  }

  async getCategoryProductOne() {
    const distinctCategories = await this.prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
    });

    const categoryList = distinctCategories.map((c) => c.category);
    const productByCategory: any[] = [];

    for (const cat of categoryList) {
      const prod = await this.prisma.product.findFirst({
        where: { category: cat },
      });
      if (prod) {
        productByCategory.push(this.formatProduct(prod));
      }
    }

    return {
      message: 'category product',
      data: productByCategory,
      success: true,
      error: false,
    };
  }

  async getCategoryWiseProduct(category: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive',
        },
      },
    });

    return {
      data: products.map((p) => this.formatProduct(p)),
      message: 'Product',
      success: true,
      error: false,
    };
  }

  async getProductDetails(productId: string) {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    return {
      data: this.formatProduct(product),
      message: 'Ok',
      success: true,
      error: false,
    };
  }

  async searchProduct(query: string) {
    if (!query) {
      return {
        message: 'Product search list',
        error: false,
        success: true,
        data: [],
      };
    }

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { productName: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { brandName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return {
      message: 'Product search list',
      error: false,
      success: true,
      data: products.map((p) => this.formatProduct(p)),
    };
  }

  async filterProduct(categories: string[]) {
    const categoryList = Array.isArray(categories) ? categories : [];

    const products = await this.prisma.product.findMany({
      where:
        categoryList.length > 0
          ? {
              category: {
                in: categoryList,
                mode: 'insensitive',
              },
            }
          : {},
    });

    return {
      data: products.map((p) => this.formatProduct(p)),
      message: 'product',
      error: false,
      success: true,
    };
  }
}
