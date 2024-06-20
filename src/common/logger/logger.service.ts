import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { ILogger } from './logger.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export const INTERFACE_TOKEN_LOGGER_SERVICE = 'LoggerService';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements ILogger {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger) {}

  private context: any;
  setContext(test: any) {
    this.context = test;
  }

  trace(message: unknown, ...params: any) {
    this.logger.debug(message, { ...params, ...this.context });
  }
  info(message: unknown, ...params: any[]) {
    this.logger.log(message, { ...params, ...this.context });
  }
  warn(message: unknown, ...params: any[]) {
    this.logger.warn(message, { ...params, ...this.context });
  }
  error(
    message: unknown,
    error: unknown,

    ...params: any[]
  ) {
    this.logger.error(message, error, { ...params, ...this.context });
  }
  fatal(
    message: unknown,
    error: unknown,

    ...params: any[]
  ) {
    this.logger.fatal(message, error, { ...params, ...this.context });
  }
}
