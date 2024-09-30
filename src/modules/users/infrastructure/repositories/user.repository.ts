import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel({
      username: user.username,
      password: user.password,
      todoLists: user.todoLists,
    });
    const result = await createdUser.save();
    return new User(
      result.id,
      result.username,
      result.password,
      result.todoLists,
    );
  }

  async update(user: User): Promise<User> {
    await this.userModel.updateOne({ _id: user.id }, user).exec();
    return user;
  }

  async findById(id: string): Promise<User> {
    const result = await this.userModel.findById(id).exec();
    if (!result) return null;
    return new User(
      result.id,
      result.username,
      result.password,
      result.todoLists,
    );
  }

  async findByUsername(username: string): Promise<User> {
    const result = await this.userModel.findOne({ username }).exec();
    if (!result) return null;
    return new User(
      result.id,
      result.username,
      result.password,
      result.todoLists,
    );
  }
}
