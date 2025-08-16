import { Body, Controller, Post } from '@nestjs/common';

import { GoalsCompletedService } from './goals-completed.service';

import { CreateGoalCompletedDTO } from './dto/create-goal-completed.dto';

@Controller('goals-completed')
export class GoalsCompletedController {
  constructor(private readonly goalsCompletedService: GoalsCompletedService) {}

  @Post()
  create(@Body() createGoalCompletedDTO: CreateGoalCompletedDTO) {
    const { goalId } = createGoalCompletedDTO;

    return this.goalsCompletedService.create({ goalId });
  }
}
