import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Items {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Items)
  products: Items[];

  @IsString()
  paymentId: number;

  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsNumber()
  total: number;
}
