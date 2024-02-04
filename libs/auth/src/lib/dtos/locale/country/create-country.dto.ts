import { PickType } from '@nestjs/swagger';
import { ARGCountryEntity } from '../../../database/entities';

export class CreateARGCountryDto extends PickType(ARGCountryEntity, [
  'isoCode',
  'name',
  'latitude',
  'longitude',
] as const) {}
