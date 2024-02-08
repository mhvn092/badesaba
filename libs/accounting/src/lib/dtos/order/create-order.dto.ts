import { PickType } from '@nestjs/swagger';
import { OrderEntity } from '../../database/entities/order';

export class CreateOrderDto extends PickType(OrderEntity, [
  'userAddress',
] as const) {}
