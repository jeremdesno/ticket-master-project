import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Get,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';

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

  @Public()
  @Get('whoami')
  async whoami(@Req() request: Request): Promise<string> {
    const token = request.cookies?.jwt;
    if (!token) throw new UnauthorizedException('No JWT provided');

    const payload = await this.authService.validateToken(token);
    if (!payload) throw new UnauthorizedException('Invalid or expired JWT');

    return payload.username;
  }
}
