import { CheckString, registerConfig } from '@lib/shared';
import { IsNotEmpty, IsString } from 'class-validator';


export enum BCRYPT_CONFIG {
  SALT_HASH = 'SALT_HASH',
}

export class BcryptConfig {
  @CheckString(false, false)
  saltHash: string;

  constructor(obj: Partial<BcryptConfig>) {
    Object.assign(this, obj);
  }
}

export const bcryptConfig = registerConfig(BcryptConfig, () => {
  const saltHash = process.env[BCRYPT_CONFIG.SALT_HASH];
  return new BcryptConfig({
    saltHash: saltHash ? saltHash : undefined,
  });
});
