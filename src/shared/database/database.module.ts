import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { GoalsRepository } from './repositories/goals.repositories';

@Global()
@Module({
  providers: [PrismaService, GoalsRepository],
  exports: [GoalsRepository],
})
export class DatabaseModule {}
