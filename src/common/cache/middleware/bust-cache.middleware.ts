import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomRequest } from '@src/common/request';
import { Response, NextFunction } from 'express';

@Injectable()
export class BustCacheMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    if (req.headers['x-bust-cache'] === 'true') {
      req.shouldBustCache = true;
    }
    next();
  }
}
