import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { TokenBlacklist } from '../users/schemas/users.schema';
// import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // This method validates a user's credentials by checking the email and password

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findone(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new BadRequestException('Invalid credentials');
  }

  // This method is used to log in a user and generate a JWT token
  async login(user: any) {
    const validatedUser = await this.validateUser(user.email, user.password); // Ensure the user is validated before generating a token
    const payload = {
      email: user.email,
      sub: validatedUser._id,
      userId: validatedUser._id,
    };
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

  // async blacklistToken(jti: string): Promise<void> {
  //   const decodedToken = this.jwtService.decode(jti);
  //   if (
  //     decodedToken &&
  //     typeof decodedToken === 'object' &&
  //     'exp' in decodedToken
  //   ) {
  //     const expiresAt = new Date(decodedToken.exp * 1000);
  //     await this.tokenBlacklistModel.create({ token: jti, expiresAt });
  //   }
  // }
}
