import { Module } from '@nestjs/common';
import {
  INTERFACE_TOKEN_LOGGER_SERVICE,
  LoggerService,
} from './logger/logger.service';

@Module({
  providers: [
    { provide: INTERFACE_TOKEN_LOGGER_SERVICE, useClass: LoggerService },
  ],
  exports: [
    { provide: INTERFACE_TOKEN_LOGGER_SERVICE, useClass: LoggerService },
  ],
})
export class CommonModule {}
