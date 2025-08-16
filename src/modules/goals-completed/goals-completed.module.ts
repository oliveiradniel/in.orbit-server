import { Module } from '@nestjs/common';

import { GoalsCompletedService } from './goals-completed.service';

import { GoalsCompletedController } from './goals-completed.controller';

@Module({
  controllers: [GoalsCompletedController],
  providers: [GoalsCompletedService],
})
export class GoalsCompletedModule {}
