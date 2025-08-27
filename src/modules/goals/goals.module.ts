import { Module } from '@nestjs/common';

import { GoalsService } from './goals.service';
import { UsersService } from '../users/users.service';

import { GoalsController } from './goals.controller';

@Module({
  imports: [],
  controllers: [GoalsController],
  providers: [GoalsService, UsersService],
})
export class GoalsModule {}
