import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { uuid } from '@spad/shared/common';
import Redis, { ChainableCommander } from 'ioredis';
import {
  RedisHashListKeysEnum,
  RedisPrefixesEnum,
  RedisProjectEnum,
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

  async getCacheFromListOfKeys<T>(keys: string[]): Promise<T | void> {
    const itemPipeline = this.pipeLine;

    keys.forEach((key) => itemPipeline.get(key));

    itemPipeline
      .exec()
      .then((res) => res.map<T>(([_, result]) => JSON.parse(result as string) as T));
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

  removeCacheList(keys: string[]) {
    const itemPipeline = this.pipeLine;

    keys.forEach((key) => itemPipeline.del(key));
    return itemPipeline.exec();
  }

  removeCacheItemFromKey(key: RedisHashListKeysEnum, id: uuid): void {
    this._redisClient.hdel(key, id);
  }

  getTtl(key: string): Promise<number> {
    return this._redisClient.ttl(key);
  }

  getItemsOfHashList<T>(hashKeyName: string, listOfKeys: string[]): Promise<T[]> {
    const itemPipeline = this.pipeLine;
    listOfKeys.forEach((key) => itemPipeline.hget(hashKeyName, key));
    return itemPipeline
      .exec()
      .then((res) => res.map<T>(([_, result]) => JSON.parse(result as string) as T));
  }

  async getAllItemsOfHashList<T>(hashKeyName: string): Promise<T[]> {
    const cachedData: Record<string, string> = await this._redisClient.hgetall(hashKeyName);
    return Object.entries(cachedData).map(([_, value]) => JSON.parse(value) as T);
  }

  setHashCache<T>(hashKey: string, field: string, value: T) {
    const stringFormat = JSON.stringify(value);
    return this._redisClient.hset(hashKey, [field, stringFormat]);
  }

  cacheMultipleHashListKeys(hashKey: string, keys: Record<string, string>) {
    this._redisClient.hset(hashKey, keys);
  }

  getStandardKey(
    project: RedisProjectEnum,
    keyPrefix: RedisPrefixesEnum,
    subPrefix: RedisSubPrefixesEnum,
    id: uuid,
  ): string {
    return project + ':' + keyPrefix + ':' + subPrefix + ':' + id;
  }

  getStandardKeyWithoutId(
    project: RedisProjectEnum,
    keyPrefix: RedisPrefixesEnum,
    subPrefix: RedisSubPrefixesEnum,
  ): string {
    return project + ':' + keyPrefix + ':' + subPrefix;
  }

  getPatternKey(
    project: RedisProjectEnum,
    keyPrefix: RedisPrefixesEnum,
    subPrefix?: RedisSubPrefixesEnum,
  ): string {
    let pattern = project + ':' + keyPrefix + ':';
    if (subPrefix) pattern += subPrefix + ':';
    return pattern + '*';
  }
}
