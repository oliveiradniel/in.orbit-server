import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthGuard } from 'src/modules/auth/auth.guard';

import { GoalsController } from '../goals.controller';

import { GoalsService } from '../goals.service';
import { UsersService } from 'src/modules/users/users.service';
import { PrismaService } from 'src/shared/database/prisma.service';

import { PrismaUsersRepository } from 'src/shared/database/repositories/users.repository';
import { PrismaGoalsRepository } from 'src/shared/database/repositories/goals.repository';

import {
  GOALS_COMPLETED_REPOSITORY,
  GOALS_REPOSITORY,
  GOALS_SERVICE,
  JWT_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
  USERS_SERVICE,
} from 'src/shared/constants/tokens';
import { PrismaGoalsCompletedRepository } from 'src/shared/database/repositories/goals-completed.repository';

@Module({
  imports: [AuthModule],
  controllers: [GoalsController],
  providers: [
    ConfigService,
    { provide: PRISMA_SERVICE, useClass: PrismaService },
    { provide: USERS_REPOSITORY, useClass: PrismaUsersRepository },
    { provide: USERS_SERVICE, useClass: UsersService },
    { provide: GOALS_SERVICE, useClass: GoalsService },
    { provide: GOALS_REPOSITORY, useClass: PrismaGoalsRepository },
    {
      provide: GOALS_COMPLETED_REPOSITORY,
      useClass: PrismaGoalsCompletedRepository,
    },
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
export class GoalsSpecModule {}
