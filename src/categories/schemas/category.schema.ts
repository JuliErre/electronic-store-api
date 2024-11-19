import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocumnt = Category & Document;

export class Category {
  @Prop({ required: true })
  name: string;

  @Prop()
  parentId: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
