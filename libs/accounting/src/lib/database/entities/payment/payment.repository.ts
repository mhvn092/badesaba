import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindManyOptions, MongoRepository } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { OrderDto, PaginationDto, objectId } from '@lib/shared';
import { ObjectId } from 'mongodb';

@Injectable()
export class PaymentRepository extends MongoRepository<PaymentEntity> {
  constructor(private _dataSource: DataSource) {
    super(PaymentEntity, _dataSource.createEntityManager());
  }

  async getOneOrFail(id: objectId, userId: objectId): Promise<PaymentEntity> {
    const payment = await this.findOne({
      where: { _id: new ObjectId(id), userId: { $eq: new ObjectId(userId) } },
    });
    if (!payment) throw new NotFoundException('پرداخت یافت نشد');
    return payment;
  }

  async getUserPaymentsWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    userId: objectId
  ): Promise<[PaymentEntity[], number]> {
    const options = {
      where: {
        userId: { $eq: userId },
      },
    };

    return this._getAllWithPagination(pagination, order, options);
  }

  getAllPaymentsWithPagination(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[PaymentEntity[], number]> {
    const options: FindManyOptions<PaymentEntity> = {};

    return this._getAllWithPagination(pagination, order, options);
  }

  async updateInfo(id: objectId, authority: string): Promise<void> {
    await this.update(id, { authority });
  }

  async getByAuthority(authority: string, paymentId = null) {
    return this.findOneBy({
        authority: { $eq: authority },
        ...(paymentId && { _id: { $eq: new ObjectId(paymentId) } }),
      })
    
  }

  private _getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    options: FindManyOptions<PaymentEntity> | any
  ): Promise<[PaymentEntity[], number]> {
    if (order?.order) {
      options.order = { [order.order]: order.orderBy };
    } else {
      options.order = { updated_at: 'DESC' };
    }
    if (pagination) {
      options.skip = pagination.skip;
      options.take = pagination.size;
    }

    return this.findAndCount(options);
  }
}
