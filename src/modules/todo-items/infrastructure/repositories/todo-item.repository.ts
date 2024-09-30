// modules/todo-items/infrastructure/repositories/todo-item.repository.ts
import { Injectable } from '@nestjs/common';
import { ITodoItemRepository } from '../../domain/repositories/todo-item.repository.interface';
import { TodoItem } from '../../domain/entities/todo-item.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoItemDocument } from '../schemas/todo-item.schema';

@Injectable()
export class TodoItemRepository implements ITodoItemRepository {
  constructor(
    @InjectModel('TodoItem') private todoItemModel: Model<TodoItemDocument>,
  ) {}

  async create(todoItem: TodoItem): Promise<TodoItem> {
    const createdTodoItem = new this.todoItemModel({
      todoListId: todoItem.todoListId,
      title: todoItem.title,
      description: todoItem.description,
      priority: todoItem.priority,
    });
    const result = await createdTodoItem.save();
    return new TodoItem(
      result.id,
      result.todoListId,
      result.title,
      result.description,
      result.priority,
    );
  }

  async update(todoItem: TodoItem): Promise<TodoItem> {
    await this.todoItemModel.updateOne({ _id: todoItem.id }, todoItem).exec();
    return todoItem;
  }

  async delete(id: string): Promise<void> {
    await this.todoItemModel.deleteOne({ _id: id }).exec();
  }

  async findById(id: string): Promise<TodoItem> {
    const result = await this.todoItemModel.findById(id).exec();
    if (!result) return null;
    return new TodoItem(
      result.id,
      result.todoListId,
      result.title,
      result.description,
      result.priority,
    );
  }

  async findByTodoListId(todoListId: string): Promise<TodoItem[]> {
    const results = await this.todoItemModel
      .find({ todoListId })
      .sort({ priority: 1 })
      .exec();
    return results.map(
      (result) =>
        new TodoItem(
          result.id,
          result.todoListId,
          result.title,
          result.description,
          result.priority,
        ),
    );
  }
}
