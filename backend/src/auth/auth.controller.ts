import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.login(user);
    response.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });
    return { message: 'Logged in successfully' };
  }

  @Public()
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    response.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }
}
