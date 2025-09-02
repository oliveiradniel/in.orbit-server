import { Module } from '@nestjs/common';

import { GoalsService } from './goals.service';
import { UsersService } from '../users/users.service';

import { GoalsController } from './goals.controller';

import { GOALS_SERVICE, USERS_SERVICE } from 'src/shared/constants/tokens';

@Module({
  imports: [],
  controllers: [GoalsController],
  providers: [
    { provide: GOALS_SERVICE, useClass: GoalsService },
    { provide: USERS_SERVICE, useClass: UsersService },
  ],
})
export class GoalsModule {}
