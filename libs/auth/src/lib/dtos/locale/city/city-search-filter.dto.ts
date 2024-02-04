import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ARGCitySearchFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  term?: string;
}
