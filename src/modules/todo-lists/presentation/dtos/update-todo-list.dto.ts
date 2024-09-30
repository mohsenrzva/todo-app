// modules/todo-lists/presentation/dtos/update-todo-list.dto.ts
import { IsNotEmpty } from 'class-validator';

export class UpdateTodoListDto {
  @IsNotEmpty()
  title: string;
}
