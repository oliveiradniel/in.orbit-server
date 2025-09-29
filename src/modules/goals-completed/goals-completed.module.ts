import { Module } from '@nestjs/common';

import { GoalsCompletedController } from './goals-completed.controller';

import { GoalsCompletedService } from './goals-completed.service';
import { UsersService } from '../users/users.service';
import { GoalsService } from '../goals/goals.service';

import {
  GOALS_COMPLETED_SERVICE,
  GOALS_SERVICE,
  USERS_SERVICE,
} from 'src/shared/constants/tokens';

@Module({
  controllers: [GoalsCompletedController],
  providers: [
    { provide: GOALS_COMPLETED_SERVICE, useClass: GoalsCompletedService },
    { provide: USERS_SERVICE, useClass: UsersService },
    { provide: GOALS_SERVICE, useClass: GoalsService },
  ],
})
export class GoalsCompletedModule {}
