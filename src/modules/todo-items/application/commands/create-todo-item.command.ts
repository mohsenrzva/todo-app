// modules/todo-items/application/commands/create-todo-item.command.ts
export class CreateTodoItemCommand {
  constructor(
    public readonly todoListId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: number,
  ) {}
}
