import { Role } from '@src/auth/enums/role.enum';
import { Request } from 'express';

export class CustomRequest extends Request {
  user: SessionUser;
  shouldBustCache: boolean = false;
}

export interface SessionUser {
  sub: string;
  username: string;
  roles?: Role[];
}
