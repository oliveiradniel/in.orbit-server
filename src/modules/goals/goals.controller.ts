import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GoalsService } from './goals.service';

import { CreateGoalDTO } from './dtos/create-goal.dto';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';

import { WeeklyGoalResponseDTO } from './dtos/weekly-goal-response.dto';
import { WeeklySummaryResponseDTO } from './dtos/weekly-summary-response.dto';
import { CreateGoalResponseDTO } from './dtos/create-goal-response.dto';

import { UnauthorizedResponseDTO } from 'src/shared/dtos/unauthorized-response.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDTO,
})
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @ApiOkResponse({
    description:
      'Returns a list of all goals with their weekly completion count',
    type: [WeeklyGoalResponseDTO],
  })
  @Get()
  findWeeklyGoalsWithCompletion(@ActiveUserId() userId: string) {
    return this.goalsService.findWeeklyGoalsWithCompletion(userId);
  }

  @ApiOkResponse({
    description:
      'Returns the weekly progress summary, including the total goals and the list of goals completed per day.',
    type: WeeklySummaryResponseDTO,
  })
  @Get('summary')
  findWeeklySummaryOfCompletedGoals(@ActiveUserId() userId: string) {
    return this.goalsService.findWeeklySummaryOfGoalsCompletedByDay(userId);
  }

  @ApiCreatedResponse({
    description:
      'Successfully creates a new goal and returns the created goal object',
    type: CreateGoalResponseDTO,
  })
  @Post()
  create(@ActiveUserId() userId: string, @Body() createGoalDTO: CreateGoalDTO) {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.goalsService.create(userId, {
      title,
      desiredWeeklyFrequency,
    });
  }
}
