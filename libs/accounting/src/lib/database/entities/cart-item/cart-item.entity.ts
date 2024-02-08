import {
  CheckBoolean,
  CheckNumber,
  CheckObjectId,
  SharedBaseEntity,
  objectId
} from '@lib/shared';
import { IsPositive } from 'class-validator';
import { Entity, Unique } from 'typeorm';

@Entity({
  name: 'cart-item',
})
@Unique('book_unique_per_cart',['cartId','bookId'])
export class CartItemEntity extends SharedBaseEntity {
  @CheckNumber()
  @IsPositive()
  quantity: number;

  @CheckObjectId('userId')
  userId: objectId;

  @CheckObjectId('cartId')
  cartId: objectId;

  @CheckObjectId('bookId')
  bookId: objectId;

  @CheckBoolean()
  isActive: boolean;
}
