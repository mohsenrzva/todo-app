// modules/todo-items/application/queries/get-todo-items.query.ts
export class GetTodoItemsQuery {
  constructor(
    public readonly todoListId: string,
    public readonly userId: string,
  ) {}
}
