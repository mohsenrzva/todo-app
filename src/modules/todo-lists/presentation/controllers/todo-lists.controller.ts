// modules/todo-lists/presentation/controllers/todo-lists.controller.ts
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
import { CreateTodoListDto } from '../dtos/create-todo-list.dto';
import { UpdateTodoListDto } from '../dtos/update-todo-list.dto';
import { CreateTodoListCommand } from '../../application/commands/create-todo-list.command';
import { UpdateTodoListCommand } from '../../application/commands/update-todo-list.command';
import { DeleteTodoListCommand } from '../../application/commands/delete-todo-list.command';
import { GetTodoListQuery } from '../../application/queries/get-todo-list.query';
import { GetTodoListsQuery } from '../../application/queries/get-todo-lists.query';
import { JwtAuthGuard } from '../../../users/presentation/guards/jwt-auth.guard';
import { TodoList } from '../../domain/entities/todo-list.entity';

@Controller('todo-lists')
@UseGuards(JwtAuthGuard)
export class TodoListsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body() createTodoListDto: CreateTodoListDto,
    @Request() req,
  ): Promise<TodoList> {
    const userId = req.user.userId;
    const { title } = createTodoListDto;
    return await this.commandBus.execute(
      new CreateTodoListCommand(userId, title),
    );
  }

  @Get()
  async findAll(@Request() req): Promise<TodoList[]> {
    const userId = req.user.userId;
    return await this.queryBus.execute(new GetTodoListsQuery(userId));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TodoList> {
    return await this.queryBus.execute(new GetTodoListQuery(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
    @Request() req,
  ): Promise<void> {
    const { title } = updateTodoListDto;
    await this.commandBus.execute(
      new UpdateTodoListCommand(id, title, req.user.userId),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    const userId = req.user.userId;
    await this.commandBus.execute(new DeleteTodoListCommand(id, userId));
  }
}
