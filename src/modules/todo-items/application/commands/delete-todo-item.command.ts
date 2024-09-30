// modules/todo-items/application/commands/delete-todo-item.command.ts
export class DeleteTodoItemCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
