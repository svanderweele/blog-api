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

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(INTERFACE_TOKEN_AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

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

  @Post('register')
  @HttpCode(200)
  async register(@Body() dto: RegisterRequestDto): Promise<void> {
    const { username, password } = dto;
    await this.authService.register(username, password);
  }
}
