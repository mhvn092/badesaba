import { PickType } from '@nestjs/swagger';
import { ARGRegionEntity } from '../../../database/entities';

export class CreateARGRegionDto extends PickType(ARGRegionEntity, [
  'name',
  'countryId',
  'stateId',
  'cityId',
  'url',
  'latitude',
  'longitude',
  'zoom',
] as const) {}
