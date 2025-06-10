import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // This endpoint is used to Register a user
  @Post('register')
  async register(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.register(CreateUserDto);
  }

  // This endpoint is used to log in a user
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // This endpoint is used to log out a user
  //   @UseGuards(LocalAuthGuard)
  //   @Post('logout')
  //   async logout(@Request() req) {
  //     const token = req.headers.authorization?.replace('Bearer ', '');
  //     return this.authService.logout(token, req.user._id);
  //   }
}
