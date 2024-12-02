import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: Category.name })
  categories: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
