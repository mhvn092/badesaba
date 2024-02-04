import { ApiProperty, PickType } from '@nestjs/swagger';
import { ARGCityEntity } from '../../../database/entities';
import { Type } from 'class-transformer';
import { IsArray, IsInstance, ValidateNested } from 'class-validator';

export class UpdateARGCityDto extends PickType(ARGCityEntity, [
  'longitude',
  'latitude',
  'isoCode',
  'name',
  'url',
  'imageId',
] as const) {}

class ARGCityPriorityDto extends PickType(ARGCityEntity, ['id', 'priority'] as const) {}

export class ARGSetCityPriorityDto {
  @ApiProperty({ type: () => ARGCityPriorityDto, isArray: true })
  @Type(() => ARGCityPriorityDto)
  @IsInstance(ARGCityPriorityDto, { each: true })
  @IsArray()
  @ValidateNested({ each: true })
  priorities: ARGCityPriorityDto[];
}
