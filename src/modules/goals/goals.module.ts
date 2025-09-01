import { Module } from '@nestjs/common';

import { GoalsService } from './goals.service';
import { UsersService } from '../users/users.service';

import { GoalsController } from './goals.controller';

import { USERS_SERVICE } from 'src/shared/constants/tokens';

@Module({
  imports: [],
  controllers: [GoalsController],
  providers: [GoalsService, { provide: USERS_SERVICE, useClass: UsersService }],
})
export class GoalsModule {}
