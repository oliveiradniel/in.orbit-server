import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { GoalsRepository } from './repositories/goals.repositories';
import { GoalsCompletedRepository } from './repositories/goals-completed.repositories';

@Global()
@Module({
  providers: [PrismaService, GoalsRepository, GoalsCompletedRepository],
  exports: [GoalsRepository, GoalsCompletedRepository],
})
export class DatabaseModule {}
