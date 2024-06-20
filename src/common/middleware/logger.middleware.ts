import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../logger/logger.interface';
import { INTERFACE_TOKEN_LOGGER_SERVICE } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.setContext({ headers: req.headers });
    next();
  }
}
