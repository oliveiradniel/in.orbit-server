import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { GoalsCompletedRepository } from './repositories/goals-completed.repository';

import { PrismaUsersRepository } from './repositories/users.repository';
import { UsersRepository } from '../contracts/users-repository.contract';
import { PrismaGoalsRepository } from './repositories/goals.repository';
import { GoalsRepository } from '../contracts/goals.repository.contract';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: GoalsRepository, useClass: PrismaGoalsRepository },
    GoalsCompletedRepository,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [GoalsRepository, GoalsCompletedRepository, UsersRepository],
})
export class DatabaseModule {}
