import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindManyOptions, MongoRepository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto, PaginationDto, objectId } from '@lib/shared';
import { ObjectId } from 'mongodb';

@Injectable()
export class OrderRepository extends MongoRepository<OrderEntity> {
  constructor(private _dataSource: DataSource) {
    super(OrderEntity, _dataSource.createEntityManager());
  }

  

  getAllWithPaginated(
    pagination: PaginationDto,
    order: OrderDto,
    conditions?: Partial<Record<keyof OrderEntity, any>>
  ): Promise<[OrderEntity[], number]> {
    const options: FindManyOptions<OrderEntity> = {
      ...(conditions && { where: conditions }),
    };

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
    conditions?: Partial<Record<keyof OrderEntity, any>>
  ): Promise<OrderEntity> {
    return this.findOne({
      where: { _id: new ObjectId(id), ...(conditions && { ...conditions }) },
    });
  }

  async getOneOrFail(
    id: objectId,
    conditions?: Partial<Record<keyof OrderEntity, any>>
  ): Promise<OrderEntity> {
    const order: OrderEntity = await this.getOne(id, conditions);
    if (!order) throw new NotFoundException('سفارش یافت نشد');
    return order;
  }
}
