// src/test/todo-items/application/commands/handlers/create-todo-item.handler.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoItemHandler } from '../../../../../modules/todo-items/application/commands/handlers/create-todo-item.handler';
import { TodoItemRepository } from '../../../../../modules/todo-items/infrastructure/repositories/todo-item.repository';
import { TodoListRepository } from '../../../../../modules/todo-lists/infrastructure/repositories/todo-list.repository';
import { CreateTodoItemCommand } from '../../../../../modules/todo-items/application/commands/create-todo-item.command';
import { TodoItem } from '../../../../../modules/todo-items/domain/entities/todo-item.entity';
import { NotFoundException } from '@nestjs/common';
import { TodoList } from '../../../../../modules/todo-lists/domain/entities/todo-list.entity';

describe('CreateTodoItemHandler', () => {
  let handler: CreateTodoItemHandler;
  let todoItemRepository: TodoItemRepository;
  let todoListRepository: TodoListRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTodoItemHandler,
        {
          provide: TodoItemRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: TodoListRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateTodoItemHandler>(CreateTodoItemHandler);
    todoItemRepository = module.get<TodoItemRepository>(TodoItemRepository);
    todoListRepository = module.get<TodoListRepository>(TodoListRepository);
  });

  it('should create a todo item and add it to the todo list', async () => {
    const command = new CreateTodoItemCommand(
      'todoListId',
      'Test Title',
      'Test Description',
      1,
    );
    const todoItem = new TodoItem(
      '1',
      'todoListId',
      'Test Title',
      'Test Description',
      1,
    );
    const todoList = new TodoList('todoListId', 'userId', 'Test List', []);

    jest.spyOn(todoItemRepository, 'create').mockResolvedValueOnce(todoItem);
    jest.spyOn(todoListRepository, 'findById').mockResolvedValueOnce(todoList);
    jest.spyOn(todoListRepository, 'update').mockResolvedValueOnce(todoList);

    const result = await handler.execute(command);

    expect(todoListRepository.findById).toHaveBeenCalledWith('todoListId');
    expect(todoItemRepository.create).toHaveBeenCalledWith(
      expect.any(TodoItem),
    );
    expect(todoListRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'todoListId',
        todoItems: ['1'],
      }),
    );
    expect(result).toEqual(todoItem);
  });

  it('should throw NotFoundException if todo list not found', async () => {
    const command = new CreateTodoItemCommand(
      'invalidTodoListId',
      'Test Title',
      'Test Description',
      1,
    );

    jest.spyOn(todoListRepository, 'findById').mockResolvedValueOnce(null);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);

    expect(todoListRepository.findById).toHaveBeenCalledWith(
      'invalidTodoListId',
    );
  });
});
