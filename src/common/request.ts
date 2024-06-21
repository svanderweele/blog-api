import { Request } from 'express';

export class CustomRequest extends Request {
  user: { sub: string; username: string };
  shouldBustCache: boolean = false;
}
