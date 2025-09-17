import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthGuard } from 'src/modules/auth/auth.guard';

import { GoalsCompletedController } from '../goals-completed.controller';

import { GoalsCompletedService } from '../goals-completed.service';
import { PrismaService } from 'src/shared/database/prisma.service';

import { PrismaGoalsCompletedRepository } from 'src/shared/database/repositories/goals-completed.repository';
import { PrismaGoalsRepository } from 'src/shared/database/repositories/goals.repository';

import {
  GOALS_COMPLETED_REPOSITORY,
  GOALS_COMPLETED_SERVICE,
  GOALS_REPOSITORY,
  JWT_SERVICE,
  PRISMA_SERVICE,
} from 'src/shared/constants/tokens';

@Module({
  imports: [AuthModule],
  controllers: [GoalsCompletedController],
  providers: [
    ConfigService,
    { provide: GOALS_COMPLETED_SERVICE, useClass: GoalsCompletedService },
    {
      provide: GOALS_COMPLETED_REPOSITORY,
      useClass: PrismaGoalsCompletedRepository,
    },
    { provide: GOALS_REPOSITORY, useClass: PrismaGoalsRepository },
    { provide: PRISMA_SERVICE, useClass: PrismaService },
    { provide: JWT_SERVICE, useClass: JwtService },
    {
      provide: APP_GUARD,
      useFactory: (jwt: JwtService, config: ConfigService) => {
        return new AuthGuard(config, jwt, new Reflector());
      },
      inject: [JwtService, ConfigService],
    },
  ],
  exports: [
    GOALS_COMPLETED_SERVICE,
    GOALS_COMPLETED_REPOSITORY,
    GOALS_REPOSITORY,
    PRISMA_SERVICE,
  ],
})
export class GoalsCompletedSpecModule {}
