import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register-user.command';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserRegisteredEvent } from 'src/shared/events/user-registered.event';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { username, password } = command;
    if (await this.userRepository.findByUsername(username)) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(null, username, hashedPassword);
    const result = await this.userRepository.create(user);
    this.eventBus.publish(new UserRegisteredEvent(result.id));
    return result;
  }
}
