import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { GoalsRepository } from './repositories/goals.repositories';
import { GoalsCompletedRepository } from './repositories/goals-completed.repositories';

import { PrismaUsersRepository } from './repositories/users.repositories';
import { UsersRepository } from '../contracts/users-repository.contract';

@Global()
@Module({
  providers: [
    PrismaService,
    GoalsRepository,
    GoalsCompletedRepository,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [GoalsRepository, GoalsCompletedRepository, UsersRepository],
})
export class DatabaseModule {}
