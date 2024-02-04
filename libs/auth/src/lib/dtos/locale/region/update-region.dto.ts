import { PickType } from '@nestjs/swagger';
import { ARGRegionEntity } from '../../../database/entities';

export class UpdateARGRegionDto extends PickType(ARGRegionEntity, [
  'name',
  'url',
  'latitude',
  'longitude',
  'zoom',
]) {}
