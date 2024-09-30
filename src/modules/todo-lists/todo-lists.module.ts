// src/modules/todo-lists/todo-lists.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoListSchema } from './infrastructure/schemas/todo-list.schema';
import { TodoListsController } from './presentation/controllers/todo-lists.controller';
import { TodoListRepository } from './infrastructure/repositories/todo-list.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteTodoListHandler } from './application/commands/handlers/delete-todo-list.handler';
import { TodoItemRepository } from '../todo-items/infrastructure/repositories/todo-item.repository';
import { UserRepository } from '../users/infrastructure/repositories/user.repository';
import { TodoItemSchema } from '../todo-items/infrastructure/schemas/todo-item.schema';
import { UserSchema } from '../users/infrastructure/schemas/user.schema';
import { CreateTodoListHandler } from './application/commands/handlers/create-todo-list.handler';
import { UpdateTodoListHandler } from './application/commands/handlers/update-todo-list.handler';
import { GetTodoListHandler } from './application/queries/handlers/get-todo-list.handler';
import { GetTodoListsHandler } from './application/queries/handlers/get-todo-lists.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TodoList', schema: TodoListSchema },
      { name: 'TodoItem', schema: TodoItemSchema },
      { name: 'User', schema: UserSchema },
    ]),
    CqrsModule,
  ],
  controllers: [TodoListsController],
  providers: [
    TodoItemRepository,
    UserRepository,
    TodoListRepository,
    CreateTodoListHandler,
    UpdateTodoListHandler,
    DeleteTodoListHandler,
    GetTodoListHandler,
    GetTodoListsHandler,
  ],
  exports: [TodoListRepository],
})
export class TodoListsModule {}
