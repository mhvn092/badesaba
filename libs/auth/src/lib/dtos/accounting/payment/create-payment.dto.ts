import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { ARGPaymentEntity } from '../../../database/entities/accounting/payment/payment.entity';

export class CreateARGPaymentDto extends PickType(ARGPaymentEntity, ['contractId'] as const) {
  @ApiPropertyOptional({
    type: Date,
    description: 'The date which customer paid the cash',
    nullable: true,
  })
  @IsOptional()
  @IsDate({
    message: 'تاریخ پرداخت نقدی معتبر نیست',
  })
  @Type(() => Date)
  cashPaidDate?: Date;
}
