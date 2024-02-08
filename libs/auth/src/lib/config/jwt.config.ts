import { registerConfig } from '@lib/shared';
import { IsNotEmpty, IsString } from 'class-validator';


export enum JWT_CONFIG {
  JWT_ACCESS_TOKEN_SECRET = 'JWT_ACCESS_TOKEN_SECRET',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME = 'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
  JWT_REFRESH_TOKEN_SECRET = 'JWT_REFRESH_TOKEN_SECRET',
  JWT_REFRESH_TOKEN_EXPIRATION_TIME = 'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
}

export class JwtConfig {
  @IsString()
  @IsNotEmpty()
  jwtAccessTokenSecret: string;

  @IsString()
  @IsNotEmpty()
  jwtAccessTokenExpirationTime: string;

  @IsString()
  @IsNotEmpty()
  jwtRefreshTokenSecret: string;

  @IsString()
  @IsNotEmpty()
  jwtRefreshTokenExpirationTime: string;

  constructor(obj: Partial<JwtConfig>) {
    Object.assign(this, obj);
  }
}

export const jwtConfig = registerConfig(JwtConfig, () => {
  return new JwtConfig({
    jwtAccessTokenSecret: process.env[JWT_CONFIG.JWT_ACCESS_TOKEN_SECRET],
    jwtAccessTokenExpirationTime: process.env[JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME],
    jwtRefreshTokenSecret: process.env[JWT_CONFIG.JWT_REFRESH_TOKEN_SECRET],
    jwtRefreshTokenExpirationTime: process.env[JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRATION_TIME],
  });
});
