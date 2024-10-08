import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product as ProductEntity } from './entities/product.entity';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  private products: ProductEntity[] = [
    {
      id: 1,
      name: 'Smartphone',
      description: 'Latest model smartphone',
      price: 699,
    },
    {
      id: 2,
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999,
    },
  ];

  create(createProductDto: CreateProductDto) {
    this.products.push({
      id: this.products.length + 1,
      ...createProductDto,
    });
    return this.products;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  findOne(id: number) {
    return this.products.find((p) => p.id === id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    this.products = this.products.map((p) =>
      p.id === id ? { ...p, ...updateProductDto } : p,
    );
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
    return `This action removes a #${id} product`;
  }
}
