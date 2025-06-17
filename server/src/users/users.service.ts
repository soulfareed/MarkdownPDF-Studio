import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // This service provides methods to interact with the User model
  async create(user: CreateUserDto) {
    if (!user.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  // This method checks if a user with the given email exists
  async findone(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  // This method retrieves all users from the database
  async findbyId(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
