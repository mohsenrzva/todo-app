// modules/todo-lists/application/commands/handlers/update-todo-list.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTodoListCommand } from '../update-todo-list.command';
import { TodoListRepository } from '../../../infrastructure/repositories/todo-list.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTodoListCommand)
export class UpdateTodoListHandler
  implements ICommandHandler<UpdateTodoListCommand>
{
  constructor(private readonly todoListRepository: TodoListRepository) {}

  async execute(command: UpdateTodoListCommand): Promise<void> {
    const { id, title, userId } = command;
    const todoList = await this.todoListRepository.findById(id);
    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }
    if (todoList.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this TodoList',
      );
    }
    todoList.title = title;
    await this.todoListRepository.update(todoList);
  }
}
