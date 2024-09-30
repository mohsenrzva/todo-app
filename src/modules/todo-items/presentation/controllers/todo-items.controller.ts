// modules/todo-items/presentation/controllers/todo-items.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTodoItemDto } from '../dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from '../dtos/update-todo-item.dto';
import { CreateTodoItemCommand } from '../../application/commands/create-todo-item.command';
import { UpdateTodoItemCommand } from '../../application/commands/update-todo-item.command';
import { DeleteTodoItemCommand } from '../../application/commands/delete-todo-item.command';
import { GetTodoItemQuery } from '../../application/queries/get-todo-item.query';
import { GetTodoItemsQuery } from '../../application/queries/get-todo-items.query';
import { JwtAuthGuard } from '../../../users/presentation/guards/jwt-auth.guard';
import { TodoItem } from '../../domain/entities/todo-item.entity';

@UseGuards(JwtAuthGuard)
@Controller('todo-items')
export class TodoItemsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':todoListId')
  async create(
    @Param('todoListId') todoListId: string,
    @Body() createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    const { title, description, priority } = createTodoItemDto;

    return await this.commandBus.execute(
      new CreateTodoItemCommand(todoListId, title, description, priority),
    );
  }

  @Get(':todoListId')
  async findAll(
    @Param('todoListId') todoListId: string,
    @Request() req,
  ): Promise<TodoItem[]> {
    const userId = req.user.userId;
    return await this.queryBus.execute(
      new GetTodoItemsQuery(todoListId, userId),
    );
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string): Promise<TodoItem> {
    return await this.queryBus.execute(new GetTodoItemQuery(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
    @Request() req,
  ): Promise<void> {
    const { title, description, priority } = updateTodoItemDto;
    const userId = req.user.userId;
    await this.commandBus.execute(
      new UpdateTodoItemCommand(id, title, description, priority, userId),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    const userId = req.user.userId;
    await this.commandBus.execute(new DeleteTodoItemCommand(id, userId));
  }
}
