// src/modules/todo-items/application/commands/handlers/delete-todo-item.handler.ts

import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteTodoItemCommand } from '../delete-todo-item.command';
import { TodoItemRepository } from '../../../infrastructure/repositories/todo-item.repository';
import { TodoListRepository } from '../../../../todo-lists/infrastructure/repositories/todo-list.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteTodoItemCommand)
export class DeleteTodoItemHandler
  implements ICommandHandler<DeleteTodoItemCommand>
{
  constructor(
    private readonly todoItemRepository: TodoItemRepository,
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(command: DeleteTodoItemCommand): Promise<void> {
    const { id, userId } = command;

    const todoItem = await this.todoItemRepository.findById(id);
    if (!todoItem) {
      throw new NotFoundException('TodoItem not found');
    }

    const todoList = await this.todoListRepository.findById(
      todoItem.todoListId,
    );
    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }

    if (todoList.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this TodoItem',
      );
    }

    // Remove the TodoItem from the TodoList's todoItems array
    todoList.todoItems = todoList.todoItems.filter((itemId) => itemId !== id);
    await this.todoListRepository.update(todoList);

    // Delete the TodoItem
    await this.todoItemRepository.delete(id);
  }
}
