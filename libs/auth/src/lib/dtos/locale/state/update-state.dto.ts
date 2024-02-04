import { PickType } from '@nestjs/swagger';
import { ARGStateEntity } from '../../../database/entities';

export class UpdateARGStateDto extends PickType(ARGStateEntity, [
  'timezone',
  'name',
  'longitude',
  'latitude',
  'isoCode',
]) {}
