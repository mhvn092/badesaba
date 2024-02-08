import {
  CheckBoolean,
  CheckEnum,
  CheckNumber,
  CheckObjectId,
  CheckString,
  SharedBaseEntity,
  objectId,
} from '@lib/shared';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Column, Entity, Unique } from 'typeorm';
import { PaymentStatusEnum } from '../../../enums';

@Entity({
  name: 'payment',
})
export class PaymentEntity extends SharedBaseEntity {
  @Column({ type: 'timestamptz', nullable: true })
  @ApiPropertyOptional({
    type: () => Date,
  })
  @Type(() => Date)
  paidDate?: Date;

  @CheckNumber()
  price: number;

  @CheckString(true, true, true)
  trackingCode?: string;

  @CheckString(true, true, true)
  authority?: string;

  @CheckBoolean()
  isCleared: boolean;

  @CheckObjectId('userId')
  userId: objectId;

  @CheckObjectId('orderId', false, true, true)
  orderId: objectId;

  @CheckEnum(PaymentStatusEnum)
  status: PaymentStatusEnum;
}
