import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlogsModule } from './blogs/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './common/logger/logger.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { VersionMiddleware } from './common/middleware/version.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BustCacheMiddleware } from './common/cache/middleware/bust-cache.middleware';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from './auth/guard/role.guard';
import { AuthGuard } from './auth/guard/auth.guard';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    WinstonModule.forRoot({ ...loggerOptions }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BlogsModule,
    CommonModule,
    UserModule,
    AuthModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BustCacheMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(VersionMiddleware).forRoutes('*');
  }
}
