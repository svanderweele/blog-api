import { Role } from '@src/auth/enums/role.enum';
import { User } from '../entity/user.entity';

export const INTERFACE_TOKEN_USER_REPOSITORY = 'IUserRepository';

export interface IUserRepository {
  /**
   * Creates a user by the given payload
   * @param dto the payload of the user
   */
  create(dto: {
    username: string;
    password: string;
    roles: Role[];
  }): Promise<User>;

  /**
   * Updates an entity by the given payload
   * @param username the entity's username
   * @param dto the payload of the user
   */
  update(
    username: string,
    dto: {
      username?: string;
      password?: string;
      roles?: Role[];
    },
  ): Promise<User>;

  /**
   * Gets a user by the username provided or null
   * @param username the username of the user
   */
  get(username: string): Promise<User | null>;
}
