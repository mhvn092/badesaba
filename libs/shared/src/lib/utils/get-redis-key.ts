import { RedisPrefixesEnum, RedisServiceEnum, RedisSubPrefixesEnum } from '../enums';

export function getStandardKey(
  service: RedisServiceEnum,
  keyPrefix: RedisPrefixesEnum,
  subPrefix: RedisSubPrefixesEnum,
  id: string,
): string {
  return service + ':' + keyPrefix + ':' + subPrefix + ':' + id;
}

export function getStandardKeyWithoutId(
  service: RedisServiceEnum,
  keyPrefix: RedisPrefixesEnum,
  subPrefix: RedisSubPrefixesEnum,
): string {
  return service + ':' + keyPrefix + ':' + subPrefix;
}

export function getPatternKey(
  service: RedisServiceEnum,
  keyPrefix: RedisPrefixesEnum,
  subPrefix?: RedisSubPrefixesEnum,
): string {
  let pattern = service + ':' + keyPrefix + ':';
  if (subPrefix) pattern += subPrefix + ':';
  return pattern + '*';
}
