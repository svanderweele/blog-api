import { User } from '../entity/user.entity';

export const INTERFACE_TOKEN_USER_SERVICE = 'IUserService';

export interface IUserService {
  createUser(username: string, password: string): Promise<void>;
  findOne(username: string): Promise<User | null>;
}
