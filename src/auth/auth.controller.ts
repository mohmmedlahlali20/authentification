import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body body: { email: string; password: string }) {
    return this.authService.register((body.email, body.password));
  }

  @UseGuards(localAuthGaurd)
  @Post('login')
  async login(@Request req) {
    return this.authService.login(req.user);
  }
}
