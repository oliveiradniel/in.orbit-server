import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { GoalsRepository } from './repositories/goals.repositories';
import { GoalsCompletedRepository } from './repositories/goals-completed.repositories';
import { UsersRepository } from './repositories/users.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    GoalsRepository,
    GoalsCompletedRepository,
    UsersRepository,
  ],
  exports: [GoalsRepository, GoalsCompletedRepository, UsersRepository],
})
export class DatabaseModule {}
