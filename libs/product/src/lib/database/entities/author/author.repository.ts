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
import { AuthorEntity } from './author.entity';

@Injectable()
export class AuthorRepository extends MongoRepository<AuthorEntity> {
  constructor(private _dataSource: DataSource) {
    super(AuthorEntity, _dataSource.createEntityManager());
  }

  getAll(
    conditions?: Partial<Record<keyof AuthorEntity, any>>
  ): Promise<AuthorEntity[]> {
    return this.find({
      where: { ...(conditions && { ...conditions }) },
      order: { created_at: 'DESC' },
    });
  }

  getAllWithPaginated(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[AuthorEntity[], number]> {
    const options: FindManyOptions<AuthorEntity> = {};

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
    conditions?: Partial<Record<keyof AuthorEntity, any>>
  ): Promise<AuthorEntity> {
    return this.findOne({
      where: { _id: new ObjectId(id), ...(conditions && { ...conditions }) },
    });
  }

  async getOneOrFail(
    id: objectId,
    conditions?: Partial<Record<keyof AuthorEntity, any>>
  ): Promise<AuthorEntity> {
    const user: AuthorEntity = await this.getOne(id, conditions);
    if (!user) throw new NotFoundException('کاربر یافت نشد');
    return user;
  }

  destroy(id: objectId): Promise<UpdateResultModel> {
    return this.softDelete(id).then((res) => ({ status: !!res.affected }));
  }

  add(user: Partial<AuthorEntity>): Promise<AuthorEntity> {
    const newInstance: AuthorEntity = this.create(user);
    return this.save(newInstance).then((res) =>
      responseWrapper(AuthorEntity, res)
    );
  }
}
