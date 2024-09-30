// modules/todo-items/application/commands/handlers/update-todo-item.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateTodoItemCommand } from '../update-todo-item.command';
import { TodoItemRepository } from '../../../infrastructure/repositories/todo-item.repository';
import { TodoListRepository } from '../../../../todo-lists/infrastructure/repositories/todo-list.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTodoItemCommand)
export class UpdateTodoItemHandler
  implements ICommandHandler<UpdateTodoItemCommand>
{
  constructor(
    private readonly todoItemRepository: TodoItemRepository,
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(command: UpdateTodoItemCommand): Promise<void> {
    const { id, title, description, priority, userId } = command;
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
        'You do not have permission to edit this TodoItem',
      );
    }

    todoItem.title = title;
    todoItem.description = description;
    todoItem.priority = priority;
    await this.todoItemRepository.update(todoItem);
  }
}
