import { EntityNotFoundError, Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILogger } from '@src/common/logger/logger.interface';
import { INTERFACE_TOKEN_LOGGER_SERVICE } from '@src/common/logger/logger.service';
import { IUserRepository } from './interfaces/user.repository.interface';
import { User } from './entity/user.entity';
import { Role } from '@src/auth/enums/role.enum';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}

  async create(dto: {
    username: string;
    password: string;
    roles: Role[];
  }): Promise<User> {
    try {
      const entity = this.repo.create({
        username: dto.username,
        password: dto.password,
        roles: dto.roles,
      });
      await this.repo.insert(entity);
      return this.repo.findOneOrFail({ where: { id: entity.id } });
    } catch (error) {
      this.logger.error(
        '[user.repository.create] Failed to create user database',
        error,
        {
          dto,
        },
      );

      throw error;
    }
  }

  async update(
    id: string,
    dto: { username?: string; password?: string; roles?: Role[] },
  ): Promise<User> {
    try {
      await this.repo.update(id, dto);
      return this.repo.findOneOrFail({ where: { id: id } });
    } catch (error) {
      this.logger.error(
        '[user.repository.update] Failed to update user in database',
        error,
        {
          id,
          dto,
        },
      );
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async get(username: string): Promise<User | null> {
    try {
      return await this.repo.findOne({
        where: { username },
      });
    } catch (error) {
      this.logger.error(
        '[user.repository.get] Failed to get user by username',
        error,
        username,
      );
      throw error;
    }
  }
}
