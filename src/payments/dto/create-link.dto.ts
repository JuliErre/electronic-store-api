import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class LinkItems {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class CreateLinkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkItems)
  items: LinkItems[];

  @IsString()
  userId: string;

  @IsString()
  email: string;
}
