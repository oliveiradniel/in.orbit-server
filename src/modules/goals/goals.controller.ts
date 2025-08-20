import { Body, Controller, Get, Post } from '@nestjs/common';

import { GoalsService } from './goals.service';

import { CreateGoalDTO } from './dto/create-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findWeeklyGoalsWithCompletion() {
    return this.goalsService.findWeeklyGoalsWithCompletion();
  }

  @Get('summary')
  async findWeeklySummaryOfCompletedGoals() {
    const summary =
      await this.goalsService.findWeeklySummaryOfGoalsCompletedByDay();

    return summary[0];
  }

  @Post()
  create(@Body() createGoalDTO: CreateGoalDTO) {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.goalsService.create({
      title,
      desiredWeeklyFrequency,
    });
  }
}
