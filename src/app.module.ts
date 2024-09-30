import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from './modules/users/users.module';
import { TodoListsModule } from './modules/todo-lists/todo-lists.module';
import { TodoItemsModule } from './modules/todo-items/todo-items.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/todo-app'),
    CqrsModule,
    UsersModule,
    TodoListsModule,
    TodoItemsModule,
  ],
})
export class AppModule {}
