// modules/todo-items/application/queries/handlers/get-todo-items.handler.ts
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetTodoItemsQuery } from '../get-todo-items.query';
import { TodoItemRepository } from '../../../infrastructure/repositories/todo-item.repository';
import { TodoListRepository } from '../../../../todo-lists/infrastructure/repositories/todo-list.repository';
import { TodoItem } from '../../../domain/entities/todo-item.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetTodoItemsQuery)
export class GetTodoItemsHandler implements IQueryHandler<GetTodoItemsQuery> {
  constructor(
    private readonly todoItemRepository: TodoItemRepository,
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(query: GetTodoItemsQuery): Promise<TodoItem[]> {
    const { todoListId, userId } = query;

    const todoList = await this.todoListRepository.findById(todoListId);
    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }

    if (todoList.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view these TodoItems',
      );
    }

    return await this.todoItemRepository.findByTodoListId(todoListId);
  }
}
