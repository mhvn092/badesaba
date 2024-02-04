import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CheckString } from '../decorators';

export class JwtRefreshDto {
  @CheckString(false,false)
  refreshToken: string | null;
}
