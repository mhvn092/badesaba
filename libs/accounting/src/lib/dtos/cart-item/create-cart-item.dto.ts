import { PickType } from '@nestjs/swagger';
import { CartItemEntity } from '../../database/entities/cart-item';

export class CreateCartItemDto extends PickType(CartItemEntity, [
  'bookId',
  'quantity',
] as const) {}
