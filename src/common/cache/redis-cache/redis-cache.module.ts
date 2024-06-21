import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { CacheService } from '../cache.service';

import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const INTERFACE_TOKEN_CACHE_REDIS = 'INTERFACE_TOKEN_CACHE_REDIS';
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          url: `redis://${config.get<string>('REDIS_HOST')}:${config.get<number>('REDIS_PORT')}`,
          ttl: 1000 * 60 * 60 * 1,
        }),
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [{ provide: INTERFACE_TOKEN_CACHE_REDIS, useClass: CacheService }],
  exports: [{ provide: INTERFACE_TOKEN_CACHE_REDIS, useClass: CacheService }],
})
export class RedisCacheModule {}
