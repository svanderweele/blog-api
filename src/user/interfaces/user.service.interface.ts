import { Role } from '@src/auth/enums/role.enum';
import { User } from '../entity/user.entity';

export const INTERFACE_TOKEN_USER_SERVICE = 'IUserService';

export interface IUserService {
  createUser(username: string, password: string, roles: Role[]): Promise<void>;
  findOne(username: string): Promise<User | null>;
}
