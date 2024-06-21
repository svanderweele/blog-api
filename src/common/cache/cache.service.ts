import { Inject, Injectable } from '@nestjs/common';
import { ICacheService } from './interface/cache.service.interface';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async get(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }
  async remove(key: string): Promise<void> {
    return await this.cacheManager.del(key);
  }
  async set(key: string, value: string): Promise<void> {
    return await this.cacheManager.set(key, value);
  }
}
