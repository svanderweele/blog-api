import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from './dto/auth.dto';
import {
  IAuthService,
  INTERFACE_TOKEN_AUTH_SERVICE,
} from './interfaces/auth.service.interface';
import { Public } from './decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    @Inject(INTERFACE_TOKEN_AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const { username, password } = loginRequestDto;
    const response = await this.authService.login({ username, password });

    if (response == null) {
      throw new UnauthorizedException();
    }

    return { sessionToken: response.accessToken };
  }

  @Public()
  @Post('register')
  @HttpCode(200)
  async register(@Body() dto: RegisterRequestDto): Promise<void> {
    const { username, password } = dto;
    await this.authService.register(username, password);
  }
}
