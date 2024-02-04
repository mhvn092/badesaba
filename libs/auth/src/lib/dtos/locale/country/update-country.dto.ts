import { PickType } from '@nestjs/swagger';
import { ARGCountryEntity } from '../../../database/entities';

export class UpdateARGCountryDto extends PickType(ARGCountryEntity, [
  'name',
  'isoCode',
  'latitude',
  'longitude',
] as const) {}
