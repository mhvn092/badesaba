import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CheckString } from '../decorators';

export class TokensDto {
  @CheckString(false, false)
  accessToken: string;

  @CheckString(false, false)
  refreshToken: string;
}
