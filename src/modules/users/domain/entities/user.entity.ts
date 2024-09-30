export class User {
  id: string;
  username: string;
  password: string;
  todoLists: string[];

  constructor(
    id: string,
    username: string,
    password: string,
    todoLists: string[] = [],
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.todoLists = todoLists;
  }
}
