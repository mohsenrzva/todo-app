// modules/todo-lists/application/commands/create-todo-list.command.ts
export class CreateTodoListCommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
  ) {}
}
