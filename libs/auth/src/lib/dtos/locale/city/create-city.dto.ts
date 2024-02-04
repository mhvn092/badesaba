import { PickType } from '@nestjs/swagger';
import { ARGCityEntity } from '../../../database/entities';

export class CreateARGCityDto extends PickType(ARGCityEntity, [
  'name',
  'isoCode',
  'countryCode',
  'latitude',
  'longitude',
  'countryId',
  'stateId',
  'url',
  'imageId',
] as const) {}
