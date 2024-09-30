// modules/todo-items/presentation/dtos/create-todo-item.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTodoItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;
}
