import { EntitySchema } from 'typeorm';
import { User } from './user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    username: {
      type: 'varchar',
      nullable: false,
      unique: true,
    },
    password: {
      type: 'varchar',
      nullable: false,
    },
  },
});
