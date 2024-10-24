import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Request } from 'express';
import {
  CreateProductDto,
  GetProductDto,
  UpdateProductDto,
  DeleteProductDto,
} from './dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Req() { user }: Request,
    @Body() body: CreateProductDto,
  ) {
    return this.productService.createProduct(user, body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    return this.productService.getProducts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param() params: GetProductDto) {
    return this.productService.getProduct(params);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param() params: GetProductDto,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(params.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  async deleteProduct(@Param() params: DeleteProductDto) {
    return this.productService.deleteProduct(params);
  }
}
