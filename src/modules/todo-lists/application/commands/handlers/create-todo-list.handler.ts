import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoListCommand } from '../create-todo-list.command';
import { TodoListRepository } from '../../../infrastructure/repositories/todo-list.repository';
import { UserRepository } from '../../../../users/infrastructure/repositories/user.repository';
import { TodoList } from '../../../domain/entities/todo-list.entity';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateTodoListCommand)
export class CreateTodoListHandler
  implements ICommandHandler<CreateTodoListCommand>
{
  constructor(
    private readonly todoListRepository: TodoListRepository,
    private readonly userRepository: UserRepository, // اضافه کردن UserRepository
  ) {}

  async execute(command: CreateTodoListCommand): Promise<TodoList> {
    const { userId, title } = command;

    const todoList = new TodoList(null, userId, title);
    const createdTodoList = await this.todoListRepository.create(todoList);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.todoLists.push(createdTodoList.id);
    await this.userRepository.update(user);

    return createdTodoList;
  }
}
