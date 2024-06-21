import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '@src/common/common.module';

@Module({
  imports: [
    CommonModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: config.get('EMAIL_HOST'),
            port: config.get('EMAIL_PORT'),
            secure: true,
            auth: {
              user: config.get('EMAIL_USERNAME'),
              pass: config.get('EMAIL_PASSWORD'),
            },
          },
        };
      },
    }),
  ],
  controllers: [MailController],
})
export class MailModule {}
