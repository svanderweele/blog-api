import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SendMailDto } from './dto/mail.dto';
import {
  INTERFACE_TOKEN_LOGGER_SERVICE,
  LoggerService,
} from '@src/common/logger/logger.service';

@Controller('mail')
export class MailController {
  /**
   *
   */
  constructor(
    private mailService: MailerService,
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE) private logger: LoggerService,
  ) {}

  @Post('')
  sendEmail(@Body() dto: SendMailDto): void {
    this.logger.trace('mail.controller.sendEmail', dto);

    dto.message += '\n';
    dto.message += 'Name';
    dto.message += '\n';
    dto.message += dto.name;
    dto.message += '\n';
    dto.message += 'Email';
    dto.message += '\n';
    dto.message += dto.email;

    this.mailService.sendMail({
      from: `Blog API <${dto.email}>`,
      to: 'vanderweelesimon@gmail.com',
      subject: `Email on blog site from ${dto.email}`,
      text: dto.message,
    });
  }
}
