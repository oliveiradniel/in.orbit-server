import { Module } from '@nestjs/common';

import { GoalsService } from './goals.service';
import { USERS_SERVICE, UsersService } from '../users/users.service';

import { GoalsController } from './goals.controller';

@Module({
  imports: [],
  controllers: [GoalsController],
  providers: [GoalsService, { provide: USERS_SERVICE, useClass: UsersService }],
})
export class GoalsModule {}
