import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { INTERFACE_TOKEN_AUTH_SERVICE } from './interfaces/auth.service.interface';
import { AuthService } from './auth.service';
import { UserModule } from '@src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [{ provide: INTERFACE_TOKEN_AUTH_SERVICE, useClass: AuthService }],
  controllers: [AuthController],
})
export class AuthModule {}
