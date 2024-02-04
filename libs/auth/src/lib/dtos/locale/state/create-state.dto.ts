import { PickType } from '@nestjs/swagger';
import { ARGStateEntity } from '../../../database/entities';

export class CreateARGStateDto extends PickType(ARGStateEntity, [
  'name',
  'isoCode',
  'latitude',
  'longitude',
  'countryCode',
  'timezone',
  'countryId',
] as const) {}
