import { registerConfig } from '../utils';
import { CheckNumber } from '../decorators';

export enum THROTTLER_CONFIG {
  THROTTLER_TTL = 'THROTTLER_TTL',
  THROTTLER_LIMIT = 'THROTTLER_LIMIT',
}

export class ThrottlerConfig {
  @CheckNumber(false, false)
  tll: number;

  @CheckNumber(false, false)
  limit: number;

  constructor(obj: Partial<ThrottlerConfig>) {
    Object.assign(this, obj);
  }
}

export const throttlerConfig = registerConfig(ThrottlerConfig, () => {
  return new ThrottlerConfig({
    tll: +process.env[THROTTLER_CONFIG.THROTTLER_TTL],
    limit: +process.env[THROTTLER_CONFIG.THROTTLER_LIMIT],
  });
});
