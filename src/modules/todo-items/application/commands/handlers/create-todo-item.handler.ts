import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoItemCommand } from '../create-todo-item.command';
import { TodoItemRepository } from '../../../infrastructure/repositories/todo-item.repository';
import { TodoListRepository } from '../../../../todo-lists/infrastructure/repositories/todo-list.repository';
import { TodoItem } from '../../../domain/entities/todo-item.entity';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateTodoItemCommand)
export class CreateTodoItemHandler
  implements ICommandHandler<CreateTodoItemCommand>
{
  constructor(
    private readonly todoItemRepository: TodoItemRepository,
    private readonly todoListRepository: TodoListRepository, // اضافه کردن TodoListRepository
  ) {}

  async execute(command: CreateTodoItemCommand): Promise<TodoItem> {
    const { todoListId, title, description, priority } = command;

    const todoItem = new TodoItem(
      null,
      todoListId,
      title,
      description,
      priority,
    );
    const createdTodoItem = await this.todoItemRepository.create(todoItem);

    const todoList = await this.todoListRepository.findById(todoListId);
    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }
    todoList.todoItems.push(createdTodoItem.id);
    await this.todoListRepository.update(todoList);

    return createdTodoItem;
  }
}
