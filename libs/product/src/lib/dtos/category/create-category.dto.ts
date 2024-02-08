import { PickType } from '@nestjs/swagger';
import { CategoryEntity } from '../../database/entities/category';

export class CreateCategoryDto extends PickType(CategoryEntity, [
  'name',
  'type',
  'isFeatured'
] as const) {}
