// modules/todo-items/infrastructure/schemas/todo-item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoItemDocument = TodoItemModel & Document;

@Schema()
export class TodoItemModel {
  @Prop({ required: true })
  todoListId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  priority: number;
}

export const TodoItemSchema = SchemaFactory.createForClass(TodoItemModel);
