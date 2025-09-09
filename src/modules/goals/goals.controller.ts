import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import dayjs from 'dayjs';

import { GoalsService } from './goals.service';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';

import { CreateGoalDTO } from './dtos/create-goal.dto';
import { FindWeeklySummaryOfCompletedGoalsDTO } from './dtos/find-weekly-summary-of-completed-goals.dto';

import { WeeklyGoalResponseDTO } from './dtos/weekly-goal-response.dto';
import { WeeklySummaryResponseDTO } from './dtos/weekly-summary-response.dto';
import { CreateGoalResponseDTO } from './dtos/create-goal-response.dto';
import { UnauthorizedResponseDTO } from 'src/shared/dtos/unauthorized-response.dto';

import { type Goal } from './entities/goal.entity';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from 'src/shared/interfaces/goal/weekly-goals-summary.interface';

import { GOALS_SERVICE } from 'src/shared/constants/tokens';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDTO,
})
@Controller('goals')
export class GoalsController {
  constructor(
    @Inject(GOALS_SERVICE) private readonly goalsService: GoalsService,
  ) {}

  @ApiOkResponse({
    description:
      'Returns a list of all goals with their weekly completion count',
    type: [WeeklyGoalResponseDTO],
  })
  @Get()
  findWeeklyGoalsWithCompletion(
    @ActiveUserId() userId: string,
  ): Promise<WeeklyGoalsProgress[]> {
    return this.goalsService.findWeeklyGoalsWithCompletion(userId);
  }

  @ApiOkResponse({
    description:
      'Returns the weekly progress summary, including the total goals and the list of goals completed per day.',
    type: WeeklySummaryResponseDTO,
  })
  @ApiQuery({
    name: 'weekStartsAt',
    required: false,
    type: String,
    description: 'First day of the week for goals filtering.',
    default: dayjs()
      .startOf('week')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss'),
  })
  @Get('summary')
  findWeeklySummaryOfCompletedGoals(
    @ActiveUserId() userId: string,
    @Query()
    queryParams: FindWeeklySummaryOfCompletedGoalsDTO,
  ): Promise<WeeklyGoalsSummary> {
    const { weekStartsAt } = queryParams;

    return this.goalsService.findWeeklySummaryOfGoalsCompletedByDay({
      userId,
      weekStartsAt,
    });
  }

  @ApiCreatedResponse({
    description:
      'Successfully creates a new goal and returns the created goal object',
    type: CreateGoalResponseDTO,
  })
  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createGoalDTO: CreateGoalDTO,
  ): Promise<Goal> {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.goalsService.create(userId, {
      title,
      desiredWeeklyFrequency,
    });
  }
}
