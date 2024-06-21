import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from './interfaces/auth.service.interface';
import {
  INTERFACE_TOKEN_USER_SERVICE,
  IUserService,
} from '@src/user/interfaces/user.service.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, LoginResponse } from './dto/auth.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(INTERFACE_TOKEN_USER_SERVICE) private userService: IUserService,
    private jwtService: JwtService,
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }

  async register(username: string, password: string): Promise<boolean> {
    const user = await this.userService.findOne(username);

    if (user) {
      return false;
    }

    const saltOrRounds = parseInt(process.env.SALT) ?? 10;
    const salt = bcrypt.genSaltSync(saltOrRounds);
    const hash = await bcrypt.hash(password, salt);
    await this.userService.createUser(username, hash);
    return true;
  }
}
