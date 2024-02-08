import {
  CheckBoolean,
  CheckEnum,
  CheckNumber,
  CheckObjectId,
  CheckString,
  SharedBaseEntity,
  objectId,
} from '@lib/shared';
import { Column, Entity } from 'typeorm';
import { OrderStatusEnum } from '../../../enums';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { CartItemEntity } from '../cart-item';

export class OrderItemEntity extends PickType(CartItemEntity, [
  'bookId',
  'quantity',
] as const) {
  @CheckObjectId('cartItemId')
  cartItemId: objectId;

  @CheckNumber()
  price: number;
}

@Entity({
  name: 'order',
})
export class OrderEntity extends SharedBaseEntity {
  @CheckNumber()
  totalPrice: number;

  @CheckNumber()
  totalItems: number;

  @CheckObjectId('userId')
  userId: objectId;

  @CheckObjectId('cartId')
  cartId: objectId;

  @CheckObjectId('paymentId', true)
  paymentId?: objectId;

  @CheckBoolean()
  isPaymentCleared: boolean;

  @CheckBoolean()
  reductionDone: boolean;

  // we can get user info like postal code and stuff

  @CheckString()
  userAddress: string;

  @CheckString(true)
  deliveryTrackingCode?: string;

  @CheckEnum(OrderStatusEnum, false, true, OrderStatusEnum.WaitingForPayment)
  status: OrderStatusEnum;

  @ApiProperty({ type: () => OrderItemEntity, isArray: true })
  @Column(() => OrderItemEntity)
  items: OrderItemEntity[];
}
