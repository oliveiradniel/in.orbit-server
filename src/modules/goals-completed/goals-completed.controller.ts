import { Controller, Post } from '@nestjs/common';

import { GoalsCompletedService } from './goals-completed.service';

@Controller('goals-completed')
export class GoalsCompletedController {
  constructor(private readonly goalsCompletedService: GoalsCompletedService) {}

  @Post()
  create() {}
}
