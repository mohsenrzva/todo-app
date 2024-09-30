// modules/todo-lists/domain/entities/todo-list.entity.ts
export class TodoList {
  id: string;
  userId: string;
  title: string;
  todoItems: string[];

  constructor(
    id: string,
    userId: string,
    title: string,
    todoItems: string[] = [],
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.todoItems = todoItems;
  }
}
