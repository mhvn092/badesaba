import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { uuid } from '@spad/shared/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ARGFileEntity } from '../../database/entities/file/file.entity';

export class ARGConfirmUploadFileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all', { each: true })
  @IsArray()
  tagIds?: string[];

  @ApiProperty({ format: 'uuid', type: String })
  @IsUUID()
  @IsNotEmpty()
  fileId: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  alt?: string;
}

export class ARGUpdateFileTagAndAltDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  alt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all', { each: true })
  @IsArray()
  tagIds: uuid[];
}

class ARGUpdateFilePriorityDto extends PickType(ARGFileEntity, ['id', 'priority'] as const) {}

export class ARGConfirmUploadDto extends PickType(ARGFileEntity, ['refId'] as const) {
  @ApiProperty({ type: () => ARGConfirmUploadFileDto, isArray: true })
  @Type(() => ARGConfirmUploadFileDto)
  @IsInstance(ARGConfirmUploadFileDto, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  files: ARGConfirmUploadFileDto[];

  @ApiProperty({ type: () => ARGUpdateFilePriorityDto, isArray: true })
  @Type(() => ARGUpdateFilePriorityDto)
  @IsInstance(ARGUpdateFilePriorityDto, { each: true })
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  mainFileIds: ARGUpdateFilePriorityDto[];

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  fromAdmin = false;
}
