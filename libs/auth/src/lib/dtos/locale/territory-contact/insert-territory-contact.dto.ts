import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInstance, IsNotEmpty, ValidateNested } from 'class-validator';
import { ARGTerritoryContactEntity } from '../../../database/entities';

export class InsertARGTerritoryContactDto extends PickType(ARGTerritoryContactEntity, [
  'contactInfo',
  'contactSourceId',
] as const) {}

export class BulkInsertARGTerritoryContactDto extends PickType(ARGTerritoryContactEntity, [
  'territoryId',
] as const) {
  @ApiProperty({ type: () => InsertARGTerritoryContactDto, isArray: true })
  @Type(() => InsertARGTerritoryContactDto)
  @IsInstance(InsertARGTerritoryContactDto, { each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  contacts: InsertARGTerritoryContactDto[];
}
