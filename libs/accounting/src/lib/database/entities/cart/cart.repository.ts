import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, MongoRepository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ObjectId } from 'mongodb';
import { objectId } from '@lib/shared';

@Injectable()
export class CartRepository extends MongoRepository<CartEntity> {
  constructor(private _dataSource: DataSource) {
    super(CartEntity, _dataSource.createEntityManager());
  }

  getOne(
    id: objectId,
    conditions?: Partial<Record<keyof CartEntity, any>>
  ): Promise<CartEntity> {
    return this.findOne({
      where: { _id: new ObjectId(id), ...(conditions && { ...conditions }) },
    });
  }

  async getOneOrFail(
    id: objectId,
    userId: objectId,
    conditions?: Partial<Record<keyof CartEntity, any>>
  ): Promise<CartEntity> {
    const cart: CartEntity = await this.getOne(id, conditions);
    
    if (!cart) throw new NotFoundException('آیتم یافت نشد');

    if (cart.userId.toString() !== userId) {
      throw new ForbiddenException('دسترسی غیرمحاز');
    }

    if (!cart.isActive) {
      throw new BadRequestException('آیتم فعال نمی باشد');
    }
    return cart;
  }
}
