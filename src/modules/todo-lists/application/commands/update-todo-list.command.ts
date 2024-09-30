export class UpdateTodoListCommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly userId: string,
  ) {}
}
