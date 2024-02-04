import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis, { ChainableCommander } from 'ioredis';
import {
  RedisPrefixesEnum,
  RedisServiceEnum,
  RedisSubPrefixesEnum,
} from '../../enums';

@Injectable()
export class RedisHelperService {
  constructor(@InjectRedis() private readonly _redisClient: Redis) {}

  get pipeLine(): ChainableCommander {
    return this._redisClient.multi();
  }

  async getCache<T>(key: string): Promise<T> {
    const cachedKey = await this._redisClient.get(key);
    if (cachedKey) {
      return JSON.parse(cachedKey) as T;
    }
  }

  async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringFormat = JSON.stringify(value);
    await this._redisClient.set(key, stringFormat);
    if (ttl) {
      await this._redisClient.expire(key, ttl);
    }
  }

  async removeCache(key: string) {
    await this._redisClient.del(key);
  }

  async deleteByPattern(pattern: string) {
    const keys = await this._redisClient.keys(pattern);
    if (keys?.length) {
      await this._redisClient.del(keys);
    }
  }

  getTtl(key: string): Promise<number> {
    return this._redisClient.ttl(key);
  }

  getStandardKey(
    project: RedisServiceEnum,
    keyPrefix: RedisPrefixesEnum,
    subPrefix: RedisSubPrefixesEnum,
    id: string
  ): string {
    return project + ':' + keyPrefix + ':' + subPrefix + ':' + id;
  }

  getStandardKeyWithoutId(
    project: RedisServiceEnum,
    keyPrefix: RedisPrefixesEnum,
    subPrefix: RedisSubPrefixesEnum
  ): string {
    return project + ':' + keyPrefix + ':' + subPrefix;
  }

  getPatternKey(
    project: RedisServiceEnum,
    keyPrefix: RedisPrefixesEnum,
    subPrefix?: RedisSubPrefixesEnum
  ): string {
    let pattern = project + ':' + keyPrefix + ':';
    if (subPrefix) pattern += subPrefix + ':';
    return pattern + '*';
  }
}
