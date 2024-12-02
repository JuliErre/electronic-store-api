import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  products: Items[];

  @Prop({ required: true })
  paymentId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
