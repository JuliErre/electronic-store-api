import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop({ required: true })
  paymentId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  detail: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
