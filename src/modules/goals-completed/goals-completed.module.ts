import { Module } from '@nestjs/common';

import { GoalsCompletedService } from './goals-completed.service';
import { GOALS_COMPLETED_SERVICE } from 'src/shared/constants/tokens';

import { GoalsCompletedController } from './goals-completed.controller';

@Module({
  controllers: [GoalsCompletedController],
  providers: [
    { provide: GOALS_COMPLETED_SERVICE, useClass: GoalsCompletedService },
  ],
})
export class GoalsCompletedModule {}
