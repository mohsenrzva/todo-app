import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
}
