import { PickType } from '@nestjs/swagger';
import { ARGTerritoryEntity } from '../../../database/entities';

export class UpdateARGTerritoryDto extends PickType(ARGTerritoryEntity, [
  'name',
  'cityIds',
] as const) {}
