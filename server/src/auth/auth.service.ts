import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // This method validates a user's credentials by checking the email and password

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findone(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  // This method is used to log in a user and generate a JWT token
  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // This method is used to register a new user
  async register(user: any) {
    const newUser = await this.usersService.create(user);
    const { password, ...result } = newUser.toObject();
    return result;
  }
}
// This method is used to log out a user by invalidating the JWT token
