import { CreateCategoryDto, UpdateCategoryDto } from '@lib/product';
import { CategoryEntity } from '@lib/product/entities';
import {
  DeleteInfo,
  GetInfo,
  GetWithPaginationInfo,
  ModulesEnum,
  OrderDto,
  Paginate,
  PaginationDto,
  PostInfo,
  PutInfo,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  SharedControllerInfo,
  UpdateResultModel,
  objectId,
} from '@lib/shared';
import { Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@SharedControllerInfo(ModulesEnum.Category, 'category', RouteTypeEnum.ADMIN)
export class CategoryAdminController {
  constructor(private readonly _categoryService: CategoryService) {}

  @PostInfo('', CreateCategoryDto, false, {
    description: 'this route creates a Category and returns the result',
    summary: 'createCategoryEntity',
    outputType: CategoryEntity,
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryEntity> {
    return this._categoryService.create(createCategoryDto);
  }

  @GetWithPaginationInfo(
    'all',
    {
      description: 'this route returns allCategoryEntity related ',
      summary: 'get allCategoryEntity',
    },
    CategoryEntity
  )
  async findAll(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto
  ): Promise<Paginate<CategoryEntity>> {
    const [categoryEntities, total] = await this._categoryService.findAll(
      pagination,
      order
    );

    return new Paginate(categoryEntities, pagination.getPagination(total));
  }

  @GetInfo(':id', ['id'], {
    description:
      'this route returns theCategoryEntity requested by the id put in the param',
    summary: 'get one city',
    outputType: CategoryEntity,
  })
  findOne(@Param('id') id: objectId): Promise<CategoryEntity> {
    return this._categoryService.findOne(id);
  }

  @PutInfo(':id', ['id'], UpdateCategoryDto, false, {
    description: 'this route can edit hisCategoryEntity',
    summary: 'edit hisCategoryEntity',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id') id: objectId,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<UpdateResultModel> {
    return this._categoryService.update(id, updateCategoryDto);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete oneCategoryEntity',
    description: 'this route deletes oneCategoryEntity',
  })
  remove(@Param('id') id: objectId): Promise<UpdateResultModel> {
    return this._categoryService.remove(id);
  }
}
