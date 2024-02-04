import { PickType } from '@nestjs/swagger';
import { ARGTerritoryEntity } from '../../../database/entities';

export class CreateARGTerritoryDto extends PickType(ARGTerritoryEntity, [
  'name',
  'cityIds',
] as const) {}
