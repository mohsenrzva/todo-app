// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/schemas/user.schema';
import { UsersController } from './presentation/controllers/users.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { RegisterUserHandler } from './application/commands/handlers/register-user.handler';
import { GetUserHandler } from './application/queries/handlers/get-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/services/auth.service';
import { LocalStrategy } from './application/strategies/local.strategy';
import { JwtStrategy } from './application/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CqrsModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UserRepository,
    RegisterUserHandler,
    GetUserHandler,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UserRepository, AuthService],
})
export class UsersModule {}
