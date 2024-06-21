import { Inject, Injectable } from '@nestjs/common';
import { ICacheService } from './interface/cache.service.interface';
import { INTERFACE_TOKEN_CACHE_MEMORY } from './memory-cache/memory-cache.module';
import { INTERFACE_TOKEN_CACHE_REDIS } from './redis-cache/redis-cache.module';
import { IAppCacheService } from './interface/app.cache.service.interface';
import { INTERFACE_TOKEN_LOGGER_SERVICE } from '../logger/logger.service';
import { ILogger } from '../logger/logger.interface';

@Injectable()
export class AppCacheService implements IAppCacheService {
  constructor(
    @Inject(INTERFACE_TOKEN_CACHE_MEMORY)
    private readonly localCache: ICacheService,
    @Inject(INTERFACE_TOKEN_CACHE_REDIS)
    private readonly redisCache: ICacheService,
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}
  async getOrSet<T>(
    key: string,
    fetchData: () => Promise<T>,
    bustCache: boolean = false,
  ): Promise<T> {
    this.logger.trace(`[app.cache.service.getOrSet] get cache value ${key}`);

    if (bustCache === false) {
      const localCache = await this.localCache.get(key);
      if (localCache) {
        this.logger.info(
          `[app.cache.service.getOrSet] found in local cache ${key}`,
        );
        return JSON.parse(localCache) as T;
      }

      this.logger.info(
        `[app.cache.service.getOrSet] not found in local cache ${key}`,
      );

      const redisCache = await this.redisCache.get(key);
      if (redisCache) {
        this.logger.info(
          `[app.cache.service.getOrSet] found in redis cache ${key}`,
        );
        await this.localCache.set(key, redisCache);
        return JSON.parse(redisCache) as T;
      }

      this.logger.info(
        `[app.cache.service.getOrSet] not found in redis cache ${key}`,
      );
    } else {
      await this.localCache.remove(key);
      await this.redisCache.remove(key);
      this.logger.info(`[app.cache.service.getOrSet] Cache Busted ${key}`);
    }

    const data = await fetchData();

    if (!data) {
      this.logger.trace(
        `[app.cache.service.getOrSet] failed to fetch data ${key}`,
        fetchData,
      );
    }

    await this.localCache.set(key, JSON.stringify(data));
    await this.redisCache.set(key, JSON.stringify(data));

    return data;
  }
}
