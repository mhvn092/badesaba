import { ARGRegionEntity } from './../../../database/entities';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ARGRegionModel extends ARGRegionEntity {}

export class FiltersARGRegionDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  term?: string;
}
