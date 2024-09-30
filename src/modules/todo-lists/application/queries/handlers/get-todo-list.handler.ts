// modules/todo-lists/application/queries/handlers/get-todo-list.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoListQuery } from '../get-todo-list.query';
import { TodoListRepository } from '../../../infrastructure/repositories/todo-list.repository';
import { TodoList } from '../../../domain/entities/todo-list.entity';

@QueryHandler(GetTodoListQuery)
export class GetTodoListHandler implements IQueryHandler<GetTodoListQuery> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  async execute(query: GetTodoListQuery): Promise<TodoList> {
    return await this.todoListRepository.findById(query.id);
  }
}
