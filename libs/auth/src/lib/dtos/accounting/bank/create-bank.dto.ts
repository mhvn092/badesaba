import { PickType } from '@nestjs/swagger';
import { ARGBankEntity } from '../../../database/entities/accounting/bank';

export class CreateARGBankDto extends PickType(ARGBankEntity, ['name', 'merchantId', 'fileId']) {}
