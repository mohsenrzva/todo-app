// src/modules/todo-lists/application/commands/delete-todo-list.command.ts

export class DeleteTodoListCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
