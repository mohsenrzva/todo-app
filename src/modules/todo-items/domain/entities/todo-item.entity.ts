// modules/todo-items/domain/entities/todo-item.entity.ts
export class TodoItem {
  id: string;
  todoListId: string;
  title: string;
  description: string;
  priority: number;

  constructor(
    id: string,
    todoListId: string,
    title: string,
    description: string,
    priority: number,
  ) {
    this.id = id;
    this.todoListId = todoListId;
    this.title = title;
    this.description = description;
    this.priority = priority;
  }
}
