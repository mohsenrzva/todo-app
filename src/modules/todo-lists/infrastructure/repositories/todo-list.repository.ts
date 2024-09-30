// modules/todo-lists/infrastructure/repositories/todo-list.repository.ts
import { Injectable } from '@nestjs/common';
import { ITodoListRepository } from '../../domain/repositories/todo-list.repository.interface';
import { TodoList } from '../../domain/entities/todo-list.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoListDocument } from '../schemas/todo-list.schema';

@Injectable()
export class TodoListRepository implements ITodoListRepository {
  constructor(
    @InjectModel('TodoList') private todoListModel: Model<TodoListDocument>,
  ) {}

  async create(todoList: TodoList): Promise<TodoList> {
    const createdTodoList = new this.todoListModel({
      userId: todoList.userId,
      title: todoList.title,
      todoItems: todoList.todoItems,
    });
    const result = await createdTodoList.save();
    return new TodoList(
      result.id,
      result.userId,
      result.title,
      result.todoItems,
    );
  }

  async update(todoList: TodoList): Promise<TodoList> {
    await this.todoListModel.updateOne({ _id: todoList.id }, todoList).exec();
    return todoList;
  }

  async delete(id: string): Promise<void> {
    await this.todoListModel.deleteOne({ _id: id }).exec();
  }

  async findById(id: string): Promise<TodoList> {
    const result = await this.todoListModel.findById(id).exec();
    if (!result) return null;
    return new TodoList(
      result.id,
      result.userId,
      result.title,
      result.todoItems,
    );
  }

  async findByUserId(userId: string): Promise<TodoList[]> {
    const results = await this.todoListModel.find({ userId }).exec();
    return results.map(
      (result) =>
        new TodoList(result.id, result.userId, result.title, result.todoItems),
    );
  }
}
