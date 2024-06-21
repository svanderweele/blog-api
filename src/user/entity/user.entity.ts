import { Role } from '@src/auth/enums/role.enum';

export class User {
  id: string;
  username: string;
  password: string;
  roles: Role[];
}
