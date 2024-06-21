import { Role } from '@src/auth/enums/role.enum';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: SessionUser;
}

export interface SessionUser {
  sub: string;
  username: string;
  roles?: Role[];
}
