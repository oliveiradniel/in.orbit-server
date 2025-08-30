import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { PrismaUsersRepository } from './repositories/users.repository';
import { USERS_REPOSITORY } from '../contracts/users-repository.contract';

import { PrismaGoalsRepository } from './repositories/goals.repository';
import { GOALS_REPOSITORY } from '../contracts/goals.repository.contract';

import { GOALS_COMPLETED_REPOSITORY } from 'src/modules/goals-completed/contracts/goals-completed.repository.contract';
import { PrismaGoalsCompletedRepository } from './repositories/goals-completed.repository';

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
