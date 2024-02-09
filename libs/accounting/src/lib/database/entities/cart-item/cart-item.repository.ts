import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, MongoRepository } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';
import { UpdateResultModel, objectId } from '@lib/shared';
import { ObjectId } from 'mongodb';

@Injectable()
export class CartItemRepository extends MongoRepository<CartItemEntity> {
  constructor(private _dataSource: DataSource) {
    super(CartItemEntity, _dataSource.createEntityManager());
  }

  getOne(
    id: objectId,
    conditions?: Partial<Record<keyof CartItemEntity, any>>
  ): Promise<CartItemEntity> {
    return this.findOne({
      where: { _id: new ObjectId(id), ...(conditions && { ...conditions }) },
    });
  }

  async getOneOrFail(
    id: objectId,
    userId: objectId,
    conditions?: Partial<Record<keyof CartItemEntity, any>>
  ): Promise<CartItemEntity> {
    const cartItem: CartItemEntity = await this.getOne(id, conditions);

    if (!cartItem) throw new NotFoundException('آیتم یافت نشد');

    if (cartItem.userId?.toString() !== userId) {
      throw new ForbiddenException('دسترسی غیرمحاز');
    }

    if (!cartItem.isActive) {
      throw new BadRequestException('آیتم فعال نمی باشد');
    }
    return cartItem;
  }

  getByCartId(cartId: objectId, userId: objectId) {
    return this.find({
      where:{
      userId: { $eq: new ObjectId(userId) },
      cartId: { $eq: new ObjectId(cartId) },
    }});
  }

  destroy(id: objectId): Promise<UpdateResultModel> {
    return this.update(id, { deletedAt: new Date() }).then((res) => ({
      status: !!res.affected,
    }));
  }
}
