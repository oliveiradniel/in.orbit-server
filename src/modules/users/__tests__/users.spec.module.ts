import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '../../auth/auth.module';
import { AuthGuard } from '../../auth/auth.guard';

import { UsersController } from '../users.controller';

import { UsersService } from '../users.service';
import { PrismaService } from 'src/shared/database/prisma.service';

import { PrismaUsersRepository } from 'src/shared/database/repositories/users.repository';

import {
  JWT_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
  USERS_SERVICE,
} from 'src/shared/constants/tokens';
import { GoalsCompletedSpecModule } from 'src/modules/goals-completed/__tests__/goals-completed.spec.module';

@Module({
  imports: [AuthModule, GoalsCompletedSpecModule],
  controllers: [UsersController],
  providers: [
    ConfigService,
    { provide: USERS_SERVICE, useClass: UsersService },
    { provide: PRISMA_SERVICE, useClass: PrismaService },
    { provide: USERS_REPOSITORY, useClass: PrismaUsersRepository },
    { provide: JWT_SERVICE, useClass: JwtService },
    {
      provide: APP_GUARD,
      useFactory: (jwt: JwtService, config: ConfigService) => {
        return new AuthGuard(config, jwt, new Reflector());
      },
      inject: [JwtService, ConfigService],
    },
  ],
})
export class UsersSpecModule {}
