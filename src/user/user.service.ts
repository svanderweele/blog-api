import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user.service.interface';
import { User } from './entity/user.entity';
import {
  INTERFACE_TOKEN_USER_REPOSITORY,
  IUserRepository,
} from './interfaces/user.interface.repository';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(INTERFACE_TOKEN_USER_REPOSITORY)
    private repository: IUserRepository,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.repository.get(username);
  }

  async createUser(username: string, password: string): Promise<void> {
    const existingUser = await this.findOne(username);

    if (existingUser) {
      throw new Error('User already exists');
    }

    await this.repository.create({ username, password });
  }
}
