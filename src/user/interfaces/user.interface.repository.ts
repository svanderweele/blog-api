import { User } from '../entity/user.entity';

export const INTERFACE_TOKEN_USER_REPOSITORY = 'IUserRepository';

export interface IUserRepository {
  /**
   * Creates a user by the given payload
   * @param dto the payload of the user
   */
  create(dto: { username: string; password: string }): Promise<User>;

  /**
   * Updates an entity by the given payload
   * @param id the entity id
   * @param dto the payload of the user
   */
  update(
    username: string,
    dto: {
      username?: string;
      password?: string;
    },
  ): Promise<User>;

  /**
   * Gets a user by the id provided or null
   * @param id the id of the user
   */
  get(username: string): Promise<User | null>;
}
