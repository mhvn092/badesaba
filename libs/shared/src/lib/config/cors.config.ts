import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, ValidateIf } from 'class-validator';
import { registerConfig } from '../utils/register.config';
import { CheckBoolean, CheckString } from '../decorators';

export enum CORS_CONFIG {
  ENABLE_CORS = 'ENABLE_CORS',
  ACCESS_CONTROL_ALLOW_ORIGIN = 'ACCESS_CONTROL_ALLOW_ORIGIN',
  ACCESS_CONTROL_ALLOW_CREDENTIALS = 'ACCESS_CONTROL_ALLOW_CREDENTIALS',
  ACCESS_CONTROL_ALLOW_METHODS = 'ACCESS_CONTROL_ALLOW_METHODS',
  ACCESS_CONTROL_ALLOW_HEADERS = 'ACCESS_CONTROL_ALLOW_HEADERS',
  ACCESS_CONTROL_MAX_AGE = 'ACCESS_CONTROL_MAX_AGE',
}

export class CorsConfig {
  @CheckBoolean(false, false)
  enableCors: boolean;

  @CheckString(true, false)
  @ValidateIf((o) => o.enableCors === true)
  accessControlAllowOrigin: string;

  @CheckBoolean(true, false)
  @ValidateIf((o) => o.enableCors === true)
  accessControlAllowCredentials: boolean;

  @CheckString(true, false)
  @ValidateIf((o) => o.enableCors === true)
  accessControlAllowMethods = 'GET,HEAD,OPTIONS,POST,PUT,DELETE';

  @CheckString(true, false)
  @ValidateIf((o) => o.enableCors === true)
  accessControlAllowHeaders: string;

  @ApiProperty()
  @IsInt()
  @ValidateIf((o) => o.enableCors === true)
  accessControlMaxAge: number;

  constructor(obj: Partial<CorsConfig>) {
    Object.assign(this, obj);
  }
}

export const corsConfig = registerConfig(CorsConfig, () => {
  const enableCors = process.env[CORS_CONFIG.ENABLE_CORS];
  return new CorsConfig({
    enableCors: enableCors ? enableCors.toLowerCase() === 'true' : undefined,
    accessControlAllowOrigin: process.env[CORS_CONFIG.ACCESS_CONTROL_ALLOW_ORIGIN],
    accessControlAllowCredentials:
      process.env[CORS_CONFIG.ACCESS_CONTROL_ALLOW_CREDENTIALS] === 'true',
    accessControlAllowHeaders: process.env[CORS_CONFIG.ACCESS_CONTROL_ALLOW_HEADERS],
    accessControlAllowMethods: process.env[CORS_CONFIG.ACCESS_CONTROL_ALLOW_METHODS],
    accessControlMaxAge: +process.env[CORS_CONFIG.ACCESS_CONTROL_MAX_AGE],
  });
});
