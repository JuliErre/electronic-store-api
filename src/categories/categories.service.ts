import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocumnt } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocumnt>,
  ) {}
  async create(name: string, parentId: string): Promise<Category> {
    const newCategory = new this.categoryModel({ name, parentId });
    return newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().lean().exec();
    console.log(categories);
    const categoriesDto = categories.map((category) => {
      return {
        id: category._id,
        name: category.name,
        parentId: category.parentId,
      };
    });
    console.log(categoriesDto);
    return categoriesDto;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
