import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ARGFileEntity } from '../../database/entities/file';
import { uuid } from '@spad/shared/common';

export class ARGSetFilePriority extends PickType(ARGFileEntity, ['id', 'priority'] as const) {}

export class ARGSetFilePriorityDto extends PickType(ARGFileEntity, ['refType'] as const) {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  @IsNotEmpty()
  refId: uuid;

  @ApiProperty({ type: () => ARGSetFilePriority, isArray: true })
  @Type(() => ARGSetFilePriority)
  @IsInstance(ARGSetFilePriority, { each: true })
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  priorities: ARGSetFilePriority[];
}
