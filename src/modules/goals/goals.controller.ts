import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import dayjs from 'dayjs';

import { GoalsService } from './goals.service';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';

import { CreateGoalDTO } from './dtos/create-goal.dto';
import { UpdateGoalDTO } from './dtos/update-goal.dto';

import { WeekStartsAtQuery } from './queries/week-starts-at.query';

import { GoalIdParam } from './params/goal-id.param';

import { WeeklyGoalResponseDOCS } from './responses/docs/weekly-goal-response.docs';
import { WeeklySummaryResponseDOCS } from './responses/docs/weekly-summary-response.docs';
import { CreateGoalResponseDOCS } from './responses/docs/create-goal-response.docs';
import { FindAllResponseDOCS } from './responses/docs/find-all-response.docs';

import { UnauthorizedResponseDOCS } from 'src/shared/responses/docs/unauthorized-response.docs';
import { NotFoundUserResponseDOCS } from 'src/shared/responses/docs/not-found-user-response.docs';
import { NotFoundUserOrGoalResponseDOCS } from 'src/shared/responses/docs/not-found-user-or-goal-response.docs';

import { type Goal } from './entities/goal.entity';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from 'src/shared/interfaces/goal/weekly-goals-summary.interface';
import { type GoalsWithTotal } from 'src/shared/interfaces/goal/goal-without-user-id.interface';

import { GOALS_SERVICE } from 'src/shared/constants/tokens';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDOCS,
})
@ApiNotFoundResponse({
  description: 'Could not find the user.',
  type: NotFoundUserResponseDOCS,
})
@Controller('goals')
export class GoalsController {
  constructor(
    @Inject(GOALS_SERVICE) private readonly goalsService: GoalsService,
  ) {}

  @ApiOkResponse({
    description:
      'Returns a list of all goals with their weekly completion count.',
    type: [WeeklyGoalResponseDOCS],
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
    type: WeeklySummaryResponseDOCS,
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
    queryParams: WeekStartsAtQuery,
  ): Promise<WeeklyGoalsSummary> {
    const { weekStartsAt } = queryParams;

    return this.goalsService.findWeeklySummaryOfGoalsCompletedByDay({
      userId,
      weekStartsAt,
    });
  }

  @ApiOkResponse({
    description:
      'Returns a list of all goals for the authenticated user along with the total count.',
    type: FindAllResponseDOCS,
  })
  @Get('all')
  findAll(@ActiveUserId() userId: string): Promise<GoalsWithTotal> {
    return this.goalsService.findAllByUserId(userId);
  }

  @ApiCreatedResponse({
    description:
      'Successfully creates a new goal and returns the created goal object.',
    type: CreateGoalResponseDOCS,
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

  @ApiOkResponse({
    description: 'Returns the updated goal after a successful update.',
    type: CreateGoalResponseDOCS,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the user or goal.',
    type: NotFoundUserOrGoalResponseDOCS,
  })
  @Patch(':goalId')
  update(
    @ActiveUserId() userId: string,
    @Param() params: GoalIdParam,
    @Body() updateGoalDTO: UpdateGoalDTO,
  ): Promise<Goal> {
    const { goalId } = params;
    const { desiredWeeklyFrequency } = updateGoalDTO;

    return this.goalsService.update(
      userId,
      { goalId },
      {
        desiredWeeklyFrequency,
      },
    );
  }
}
