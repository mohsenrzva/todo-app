// modules/todo-items/domain/repositories/todo-item.repository.interface.ts
import { TodoItem } from '../entities/todo-item.entity';

export interface ITodoItemRepository {
  create(todoItem: TodoItem): Promise<TodoItem>;
  update(todoItem: TodoItem): Promise<TodoItem>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<TodoItem>;
  findByTodoListId(todoListId: string): Promise<TodoItem[]>;
}
