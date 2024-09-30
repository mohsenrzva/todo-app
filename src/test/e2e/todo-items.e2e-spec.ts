// src/test/e2e/todo-items.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { disconnect } from 'mongoose';

describe('TodoItemsController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let todoListId: string;
  let todoItemId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot('mongodb://localhost/todo-app-test'),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Register a user
    await request(app.getHttpServer())
      .post('/users/register')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(201);

    // Login the user
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(201);

    jwtToken = loginResponse.body.access_token;

    // Create a TodoList
    const todoListResponse = await request(app.getHttpServer())
      .post('/todo-lists')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Test Todo List' })
      .expect(201);

    todoListId = todoListResponse.body.id;
  });
  it('/todo-items/:todoListId (POST) should create a todo item', async () => {
    const response = await request(app.getHttpServer())
      .post(`/todo-items/${todoListId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Test Todo Item',
        description: 'Test Description',
        priority: 1,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Todo Item');
    expect(response.body.description).toBe('Test Description');
    expect(response.body.priority).toBe(1);

    todoItemId = response.body.id;
  });

  it('/todo-items/:todoListId (GET) should get todo items', async () => {
    const response = await request(app.getHttpServer())
      .get(`/todo-items/${todoListId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('id');
  });

  it('/todo-items/item/:id (GET) should get a todo item', async () => {
    const response = await request(app.getHttpServer())
      .get(`/todo-items/item/${todoItemId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', todoItemId);
    expect(response.body.title).toBe('Test Todo Item');
  });

  it('/todo-items/:id (PUT) should update a todo item', async () => {
    await request(app.getHttpServer())
      .put(`/todo-items/${todoItemId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Updated Todo Item',
        description: 'Updated Description',
        priority: 2,
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/todo-items/item/${todoItemId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body.title).toBe('Updated Todo Item');
    expect(response.body.description).toBe('Updated Description');
    expect(response.body.priority).toBe(2);
  });

  it('/todo-items/:id (DELETE) should delete a todo item', async () => {
    await request(app.getHttpServer())
      .delete(`/todo-items/${todoItemId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/todo-items/item/${todoItemId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  afterAll(async () => {
    await disconnect(); // Close Mongoose connection
    await app.close();
  });
});
