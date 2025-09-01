import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { PrismaUsersRepository } from './repositories/users.repository';
import { PrismaGoalsRepository } from './repositories/goals.repository';
import { PrismaGoalsCompletedRepository } from './repositories/goals-completed.repository';

import {
  GOALS_COMPLETED_REPOSITORY,
  GOALS_REPOSITORY,
  USERS_REPOSITORY,
} from '../constants/tokens';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: GOALS_REPOSITORY, useClass: PrismaGoalsRepository },
    {
      provide: GOALS_COMPLETED_REPOSITORY,
      useClass: PrismaGoalsCompletedRepository,
    },
    { provide: USERS_REPOSITORY, useClass: PrismaUsersRepository },
  ],
  exports: [GOALS_REPOSITORY, GOALS_COMPLETED_REPOSITORY, USERS_REPOSITORY],
})
export class DatabaseModule {}
