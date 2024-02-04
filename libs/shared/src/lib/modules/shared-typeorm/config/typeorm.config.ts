import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { registerConfig } from '../../../utils';
import { CheckNumber, CheckString } from '../../../decorators';

enum TYPEORM_CONFIG {
  TYPEORM_CONNECTION = 'TYPEORM_CONNECTION',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_PORT = 'TYPEORM_PORT',
  TYPEORM_URL = 'TYPEORM_URL',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_SLAVE_PORT = 'TYPEORM_SLAVE_PORT',
  TYPEORM_MIGRATIONS = 'TYPEORM_MIGRATIONS',
  TYPEORM_MONGO_AUTH_SOURCE = 'TYPEORM_MONGO_AUTH_SOURCE',
}

export class TypeormConfig {
  @CheckString(false, false)
  connection: string;

  @CheckNumber(false, false)
  port = 5432;

  @CheckString(false, false)
  host: string;

  @CheckString(false, false)
  database: string;

  @CheckString(false, false)
  username: string;

  @CheckString(false, false)
  password: string;

  @CheckString(false, false)
  logging = 'all';

  @CheckString(true, false)
  migrations?: string;

  constructor(obj: Partial<TypeormConfig>) {
    Object.assign(this, obj);
  }

  // @IsString()
  // @IsOptional()
  // typeormUrl?: string;

  // /**
  //  * since we are using this config for both sql databases and mongo
  //  * we can put this config in the driver extra config but we need that  for migration
  //  * and we wanna have a separate one for the the connection, hence this config
  //  **/
  // @IsString()
  // @IsOptional()
  // mongoAuthSource?: string;
}

export const typeormConfig = registerConfig(TypeormConfig, () => {
  const port = process.env[TYPEORM_CONFIG.TYPEORM_PORT];
  return new TypeormConfig({
    connection: process.env[TYPEORM_CONFIG.TYPEORM_CONNECTION],
    host: process.env[TYPEORM_CONFIG.TYPEORM_HOST],
    database: process.env[TYPEORM_CONFIG.TYPEORM_DATABASE],
    username: process.env[TYPEORM_CONFIG.TYPEORM_USERNAME],
    password: process.env[TYPEORM_CONFIG.TYPEORM_PASSWORD],
    migrations: process.env[TYPEORM_CONFIG.TYPEORM_MIGRATIONS],
    // typeormUrl: process.env[TYPEORM_CONFIG.TYPEORM_URL],
    port: port ? +port : undefined,
    // mongoAuthSource: process.env[TYPEORM_CONFIG.TYPEORM_MONGO_AUTH_SOURCE],
  });
});
