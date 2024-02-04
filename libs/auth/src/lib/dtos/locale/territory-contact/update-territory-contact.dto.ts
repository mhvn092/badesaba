import { ARGTerritoryContactEntity } from '../../../database/entities/locale/territory-contact';
import { PickType } from '@nestjs/swagger';

export class UpdateARGTerritoryContactDto extends PickType(ARGTerritoryContactEntity, [
  'contactInfo',
] as const) {}
