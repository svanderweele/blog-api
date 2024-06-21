import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { ILogger } from './logger.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export const INTERFACE_TOKEN_LOGGER_SERVICE = 'LoggerService';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements ILogger {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger) {}

  private context: any;
  setContext(context: any) {
    this.context = context;
  }

  getLogBody(message: unknown, params: any) {
    return { message, ...this.context, extraData: params };
  }

  trace(message: unknown, params: any) {
    this.logger.debug(this.getLogBody(message, params));
  }
  info(message: unknown, params: any) {
    this.logger.log(this.getLogBody(message, params));
  }
  warn(message: unknown, params: any) {
    this.logger.warn(this.getLogBody(message, params));
  }
  error(message: unknown, error: unknown, params: any) {
    this.logger.error({ ...this.getLogBody(message, params), error });
  }
  fatal(message: unknown, error: unknown, params: any) {
    this.logger.error({
      isFatalError: true,
      ...this.getLogBody(message, params),
      error,
    });
  }
}
