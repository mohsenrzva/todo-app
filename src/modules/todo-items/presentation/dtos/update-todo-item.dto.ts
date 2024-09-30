// modules/todo-items/presentation/dtos/update-todo-item.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateTodoItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;
}
