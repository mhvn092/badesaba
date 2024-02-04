import { IsIn, Matches } from 'class-validator';
import { registerConfig } from '../utils';
import { URL_WITHOUT_TRAILING_SLASH } from '../constants';
import { CheckNumber, CheckString } from '../decorators';

export enum APP_CONFIG {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  HOST = 'HOST',
  DOMAIN = 'DOMAIN',
  CLIENT_HOST = 'CLIENT_HOST',
  SERVER_HOST = 'SERVER_HOST',
}

export class AppConfig {
  @CheckString(false, false)
  @IsIn(['development', 'production', 'test'])
  nodeEnv = 'production';

  @CheckNumber(false, false)
  port = 3115;

  @CheckString(false, false)
  @Matches(URL_WITHOUT_TRAILING_SLASH)
  clientHost: string;

  @CheckString(false, false)
  host: string;

  @CheckString(false, false)
  domain: string;

  @CheckString(true, false)
  @Matches(URL_WITHOUT_TRAILING_SLASH)
  serverHost: string;

  constructor(obj: Partial<AppConfig>) {
    Object.assign(this, obj);
  }
}

export const appConfig = registerConfig(AppConfig, () => {
  const port = process.env[APP_CONFIG.PORT];
  return new AppConfig({
    nodeEnv: process.env[APP_CONFIG.NODE_ENV] || 'development',
    port: port ? +port : undefined,
    host: process.env[APP_CONFIG.HOST],
    clientHost: process.env[APP_CONFIG.CLIENT_HOST],
    domain: process.env[APP_CONFIG.DOMAIN],
    serverHost: process.env[APP_CONFIG.SERVER_HOST],
  });
});
