// modules/todo-lists/application/queries/handlers/get-todo-lists.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoListsQuery } from '../get-todo-lists.query';
import { TodoListRepository } from '../../../infrastructure/repositories/todo-list.repository';
import { TodoList } from '../../../domain/entities/todo-list.entity';

@QueryHandler(GetTodoListsQuery)
export class GetTodoListsHandler implements IQueryHandler<GetTodoListsQuery> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  async execute(query: GetTodoListsQuery): Promise<TodoList[]> {
    return await this.todoListRepository.findByUserId(query.userId);
  }
}
