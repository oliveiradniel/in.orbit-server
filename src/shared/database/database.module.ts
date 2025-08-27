import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { PrismaUsersRepository } from './repositories/users.repository';
import { UsersRepository } from '../contracts/users-repository.contract';
import { PrismaGoalsRepository } from './repositories/goals.repository';
import { GoalsRepository } from '../contracts/goals.repository.contract';
import { GoalsCompletedRepository } from 'src/modules/goals-completed/contracts/goals-completed.repository.contract';
import { PrismaGoalsCompletedRepository } from './repositories/goals-completed.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: GoalsRepository, useClass: PrismaGoalsRepository },
    {
      provide: GoalsCompletedRepository,
      useClass: PrismaGoalsCompletedRepository,
    },
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [GoalsRepository, GoalsCompletedRepository, UsersRepository],
})
export class DatabaseModule {}
