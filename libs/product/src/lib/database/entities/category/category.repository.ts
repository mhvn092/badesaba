import {
  OrderDto,
  PaginationDto,
  UpdateResultModel,
  objectId,
  responseWrapper,
} from '@lib/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DataSource, MongoRepository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryRepository extends MongoRepository<CategoryEntity> {
  constructor(private _dataSource: DataSource) {
    super(CategoryEntity, _dataSource.createEntityManager());
  }

  getAll(
    conditions?: Partial<Record<keyof CategoryEntity, any>>
  ): Promise<CategoryEntity[]> {
    return this.find({
      where: { ...(conditions && { ...conditions }) },
      order: { created_at: 'DESC' },
    });
  }

  getAllWithPaginated(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[CategoryEntity[], number]> {
    const options: FindManyOptions<CategoryEntity> = {};

    if (order?.order) {
      options.order = { [order.order]: order.orderBy };
    } else {
      options.order = { created_at: 'DESC' };
    }
    if (pagination) {
      options.skip = pagination.skip;
      options.take = pagination.size;
    }
    return this.findAndCount(options);
  }

  getOne(
    id: objectId,
    conditions?: Partial<Record<keyof CategoryEntity, any>>
  ): Promise<CategoryEntity> {
    return this.findOne({
      where: { _id: new ObjectId(id), ...(conditions && { ...conditions }) },
    });
  }

  async getOneOrFail(
    id: objectId,
    conditions?: Partial<Record<keyof CategoryEntity, any>>
  ): Promise<CategoryEntity> {
    const category: CategoryEntity = await this.getOne(id, conditions);
    if (!category) throw new NotFoundException('دسته بندی یافت نشد');
    return category;
  }

  destroy(id: objectId): Promise<UpdateResultModel> {
    return this.update(id, { deletedAt: new Date() }).then((res) => ({
      status: !!res.affected,
    }));
  }

  add(category: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const newInstance: CategoryEntity = this.create(category);
    return this.save(newInstance).then((res) =>
      responseWrapper(CategoryEntity, res)
    );
  }
}
