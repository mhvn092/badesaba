import { PickType } from '@nestjs/swagger';
import { ARGContractEntity } from '../../../database/entities/accounting/contract/contract.entity';

export class CreateARGContractDto extends PickType(ARGContractEntity, [
  'adId',
  'sectionId',
  'planDurationId',
  'description',
] as const) {}

export class PreviewARGAdContractDto extends PickType(CreateARGContractDto, [
  'adId',
  'sectionId',
  'planDurationId',
] as const) {}

export class PreviewARGContractTotalPriceDto extends PickType(ARGContractEntity, [
  'totalPrice',
] as const) {}
