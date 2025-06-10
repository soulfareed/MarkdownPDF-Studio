import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // This guard uses the 'jwt' strategy defined in the JwtStrategy class
  // It will automatically validate JWT tokens for protected routes
  // You can add additional logic here if needed, such as logging or custom error handling
}
