import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheService } from '../cache.service';

export const INTERFACE_TOKEN_CACHE_MEMORY = 'INTERFACE_TOKEN_CACHE_MEMORY';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1000 * 60 * 60 * 1,
    }),
  ],
  providers: [
    { provide: INTERFACE_TOKEN_CACHE_MEMORY, useClass: CacheService },
  ],
  exports: [{ provide: INTERFACE_TOKEN_CACHE_MEMORY, useClass: CacheService }],
})
export class MemoryCacheModule {}
