import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, GetProductDto, UpdateProductDto } from './dto';
import { Product } from './product.schema';
import { User } from '../user/user.schema';
import { DeleteProductDto } from './dto/deleteProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  /**
   * Get all products
   * @returns {Promise<Product[]>} - List of products
   */
  async getProducts(): Promise<Product[]> {
    return this.productModel
      .find()
      .populate({
        path: 'createdBy',
        select: '-password -__v',
      })
      .lean();
  }

  /**
   * Create a new product
   * @param {User} user - User object
   * @param {CreateProductDto} body - Product details
   * @returns {Promise<Product>} - Product create
   */
  async createProduct(
    user: User,
    { name, description, price, category }: CreateProductDto,
  ): Promise<Product> {
    const product = new this.productModel({
      name,
      description,
      price,
      category,
      createdBy: user,
    });
    return product.save();
  }

  /**
   * Get a product by id
   * @param {GetProductDto} id - Product id
   * @returns {Promise<Product>} - Product details
   * @throws {NotFoundException} - Product not found
   */
  async getProduct({ id }: GetProductDto): Promise<Product> {
    const product = await this.productModel.findById(id).populate({
      path: 'createdBy',
      select: '-password -__v',
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  /**
   * Update a product
   * @param {string} id - Product id
   * @param {UpdateProductDto} body - Product details
   * @returns {Promise<Product>} - Updated product
   * @throws {NotFoundException} - Product not found
   */
  async updateProduct(
    id: string,
    { name, price, description, category }: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    name && (product.name = name);
    price && (product.price = price);
    description && (product.description = description);
    category && (product.category = category);

    return product.save();
  }

  /**
   * Delete a product
   * @param {DeleteProductDto} id - Product id
   * @returns {Promise<{ success: boolean }>} - Success message
   */
  async deleteProduct({ id }: DeleteProductDto): Promise<{ success: boolean }> {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { success: true };
  }
}
