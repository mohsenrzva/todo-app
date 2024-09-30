// modules/todo-lists/presentation/dtos/create-todo-list.dto.ts
import { IsNotEmpty } from 'class-validator';

export class CreateTodoListDto {
  @IsNotEmpty()
  title: string;
}
