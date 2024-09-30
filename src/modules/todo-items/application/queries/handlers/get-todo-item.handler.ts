// modules/todo-items/application/queries/handlers/get-todo-item.handler.ts

import { GetTodoItemQuery } from '../get-todo-item.query';
import { TodoItemRepository } from '../../../infrastructure/repositories/todo-item.repository';
import { TodoListRepository } from '../../../../todo-lists/infrastructure/repositories/todo-list.repository';
import { TodoItem } from '../../../domain/entities/todo-item.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetTodoItemQuery)
export class GetTodoItemHandler implements IQueryHandler<GetTodoItemQuery> {
  constructor(
    private readonly todoItemRepository: TodoItemRepository,
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(query: GetTodoItemQuery): Promise<TodoItem> {
    const todoItem = await this.todoItemRepository.findById(query.id);
    if (!todoItem) {
      throw new NotFoundException('TodoItem not found');
    }

    return todoItem;
  }
}
