import { Module } from '@nestjs/common';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { MemoryCacheModule } from './memory-cache/memory-cache.module';
import { AppCacheService } from './app.cache.service';
import { CommonModule } from '../common.module';

export const INTERFACE_TOKEN_CACHE_APP = 'INTERFACE_TOKEN_CACHE_APP';

@Module({
  imports: [RedisCacheModule, MemoryCacheModule, CommonModule],
  providers: [
    { provide: INTERFACE_TOKEN_CACHE_APP, useClass: AppCacheService },
  ],
  exports: [{ provide: INTERFACE_TOKEN_CACHE_APP, useClass: AppCacheService }],
})
export class CacheModule {}
