import { CategoryEntity } from '@lib/product/entities';
import {
  GetInfo,
  ModulesEnum,
  RouteTypeEnum,
  SharedControllerInfo,
} from '@lib/shared';
import { CategoryService } from './category.service';

@SharedControllerInfo(ModulesEnum.Category, 'category', RouteTypeEnum.PUBLIC)
export class CategoryPublicController {
  constructor(private readonly _categoryService: CategoryService) {}

  @GetInfo('all', null, {
    description: 'this route returns all the CategoryEntity',
    summary: 'get all  categories ',
    outputType: CategoryEntity,
    outputIsArray: true,
  })
  findAll(): Promise<CategoryEntity[]> {
    return this._categoryService.getAllWithoutPagination();
  }
}
