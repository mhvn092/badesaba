import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { ARGFileRefTypeEnum } from '@spad/shared/aroosi-org';
import { IsEnum, IsOptional } from 'class-validator';
import { ARGFileEntity } from '../../database/entities/file';

export class ARGFilterFilesDto extends PartialType(
  PickType(ARGFileEntity, ['refType', 'refId', 'status', 'isForCloud', 'fileType'] as const),
) {}

export class ARGFilterFilesWithUserDto extends PickType(ARGFilterFilesDto, [
  'status',
  'isForCloud',
  'fileType',
] as const) {
  @ApiPropertyOptional({ enum: ARGFileRefTypeEnum })
  @IsEnum(ARGFileRefTypeEnum)
  @IsOptional()
  refType?: ARGFileRefTypeEnum;
}
