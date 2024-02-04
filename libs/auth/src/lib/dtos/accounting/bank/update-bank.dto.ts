import { PickType } from '@nestjs/swagger';
import { ARGBankEntity } from '../../../database/entities/accounting/bank';

export class UpdateARGBankDto extends PickType(ARGBankEntity, ['name', 'merchantId'] as const) {}
