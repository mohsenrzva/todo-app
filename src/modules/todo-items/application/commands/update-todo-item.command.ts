// modules/todo-items/application/commands/update-todo-item.command.ts
export class UpdateTodoItemCommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: number,
    public readonly userId: string,
  ) {}
}
