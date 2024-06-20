import { LoginRequest, LoginResponse } from '../dto/auth.dto';

export const INTERFACE_TOKEN_AUTH_SERVICE = 'IAuthService';

export interface IAuthService {
  register(username: string, password: string): Promise<boolean>;
  login(request: LoginRequest): Promise<LoginResponse>;
}
