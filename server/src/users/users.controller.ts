import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Get all users

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  // Get user by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findbyId(id);
  }
}
