import { Module } from '@nestjs/common';

import { GoalsService } from './goals.service';

import { GoalsController } from './goals.controller';

@Module({
  imports: [],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
