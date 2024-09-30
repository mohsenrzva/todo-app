// modules/todo-lists/infrastructure/schemas/todo-list.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoListDocument = TodoListModel & Document;

@Schema()
export class TodoListModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], default: [] })
  todoItems: string[];
}

export const TodoListSchema = SchemaFactory.createForClass(TodoListModel);
