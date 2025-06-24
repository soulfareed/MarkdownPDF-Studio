import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserRequest } from './dto/login-user-request';
import { access } from 'node:fs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // This endpoint is used to Register a user
  @Post('register')
  async register(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.register(CreateUserDto);
  }

  // This endpoint is used to log in a user
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: LoginUserRequest) {
    return this.authService.login(user);
  }

  // This endpoint is used to log out a user
  @Post('logout')
  async logout(@Req() req: any, @Res() res: any) {
    try {
      // await this.authService.blacklistToken(req.user.jti);
      return res.status(200).json({
        message: 'Logout successful',
        access_token: '',
        expires_in: 0,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Logout failed', error: error.message });
    }
  }
}
