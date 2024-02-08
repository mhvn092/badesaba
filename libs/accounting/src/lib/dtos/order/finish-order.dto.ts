import { PickType } from '@nestjs/swagger';
import { OrderEntity } from '../../database/entities/order';

export class FinishOrderDto extends PickType(OrderEntity, [
  'deliveryTrackingCode',
] as const) {}
