import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { ARGFileEntity } from '../../database/entities';
import { IsEnum, IsOptional } from 'class-validator';
import { ARGFileRefTypeEnum } from '@spad/shared/aroosi-org';

export class ARGRefTypeParamDto extends PickType(ARGFileEntity, ['refType']) {}

export class ARGRefTypeOptionalQueryDto {
  @ApiPropertyOptional({ enum: ARGFileRefTypeEnum })
  @IsEnum(ARGFileRefTypeEnum)
  @IsOptional()
  refType?: ARGFileRefTypeEnum;
}
