import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { GoalsRepository } from './repositories/goals.repository';
import { GoalsCompletedRepository } from './repositories/goals-completed.repository';

import { PrismaUsersRepository } from './repositories/users.repository';
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
