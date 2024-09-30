// src/modules/todo-lists/application/commands/handlers/delete-todo-list.handler.ts

import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteTodoListCommand } from '../delete-todo-list.command';
import { TodoListRepository } from '../../../infrastructure/repositories/todo-list.repository';
import { TodoItemRepository } from '../../../../todo-items/infrastructure/repositories/todo-item.repository';
import { UserRepository } from '../../../../users/infrastructure/repositories/user.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteTodoListCommand)
export class DeleteTodoListHandler
  implements ICommandHandler<DeleteTodoListCommand>
{
  constructor(
    private readonly todoListRepository: TodoListRepository,
    private readonly todoItemRepository: TodoItemRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteTodoListCommand): Promise<void> {
    const { id, userId } = command;

    const todoList = await this.todoListRepository.findById(id);
    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }

    if (todoList.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this TodoList',
      );
    }

    // Delete all TodoItems associated with the TodoList
    for (const todoItemId of todoList.todoItems) {
      await this.todoItemRepository.delete(todoItemId);
    }

    // Remove the TodoList from the user's todoLists array
    const user = await this.userRepository.findById(userId);
    if (user) {
      user.todoLists = user.todoLists.filter((listId) => listId !== id);
      await this.userRepository.update(user);
    }

    // Delete the TodoList
    await this.todoListRepository.delete(id);
  }
}
