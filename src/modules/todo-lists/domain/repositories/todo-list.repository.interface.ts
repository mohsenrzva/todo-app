// modules/todo-lists/domain/repositories/todo-list.repository.interface.ts
import { TodoList } from '../entities/todo-list.entity';

export interface ITodoListRepository {
  create(todoList: TodoList): Promise<TodoList>;
  update(todoList: TodoList): Promise<TodoList>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<TodoList>;
  findByUserId(userId: string): Promise<TodoList[]>;
}
