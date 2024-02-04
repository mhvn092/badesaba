import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ARGFileTypeEnum } from '@spad/shared/aroosi-org';

export class ARGTempRefIdQueryDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  refId: string;
}

export class ARGTempCreateFileDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  refId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ type: 'number' })
  @IsInt()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  videoCount?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  size?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @ApiPropertyOptional({ enum: ARGFileTypeEnum, default: ARGFileTypeEnum.Image })
  @IsEnum(ARGFileTypeEnum)
  @IsOptional()
  fileType?: ARGFileTypeEnum;
}
