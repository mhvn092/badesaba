import { RedisPrefixesEnum, RedisProjectEnum, RedisSubPrefixesEnum } from '../enums';

export function getStandardKey(
  project: RedisProjectEnum,
  keyPrefix: RedisPrefixesEnum,
  subPrefix: RedisSubPrefixesEnum,
  id: string,
): string {
  return project + ':' + keyPrefix + ':' + subPrefix + ':' + id;
}

export function getStandardKeyWithoutId(
  project: RedisProjectEnum,
  keyPrefix: RedisPrefixesEnum,
  subPrefix: RedisSubPrefixesEnum,
): string {
  return project + ':' + keyPrefix + ':' + subPrefix;
}

export function getPatternKey(
  project: RedisProjectEnum,
  keyPrefix: RedisPrefixesEnum,
  subPrefix?: RedisSubPrefixesEnum,
): string {
  let pattern = project + ':' + keyPrefix + ':';
  if (subPrefix) pattern += subPrefix + ':';
  return pattern + '*';
}
