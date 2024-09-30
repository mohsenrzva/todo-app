// modules/todo-items/todo-items.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoItemSchema } from './infrastructure/schemas/todo-item.schema';
import { TodoItemsController } from './presentation/controllers/todo-items.controller';
import { TodoItemRepository } from './infrastructure/repositories/todo-item.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTodoItemHandler } from './application/commands/handlers/create-todo-item.handler';
import { UpdateTodoItemHandler } from './application/commands/handlers/update-todo-item.handler';
import { DeleteTodoItemHandler } from './application/commands/handlers/delete-todo-item.handler';
import { GetTodoItemHandler } from './application/queries/handlers/get-todo-item.handler';
import { GetTodoItemsHandler } from './application/queries/handlers/get-todo-items.handler';
import { TodoListsModule } from '../todo-lists/todo-lists.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TodoItem', schema: TodoItemSchema }]),
    CqrsModule,
    TodoListsModule,
  ],
  controllers: [TodoItemsController],
  providers: [
    TodoItemRepository,
    CreateTodoItemHandler,
    UpdateTodoItemHandler,
    DeleteTodoItemHandler,
    GetTodoItemHandler,
    GetTodoItemsHandler,
  ],
  exports: [TodoItemRepository],
})
export class TodoItemsModule {}
