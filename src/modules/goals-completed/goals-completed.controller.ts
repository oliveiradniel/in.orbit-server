import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';

import { GoalsCompletedService } from './goals-completed.service';

import { CreateGoalCompletedDTO } from './dtos/create-goal-completed.dto';

import { CreateGoalCompletedResponseDOCS } from './responses/docs/create-goal-completed-response.docs';
import { ConflictGoalsCompletedResponseDOCS } from './responses/docs/conflict-goals-completed-response.docs';
import { BadRequestGoalsCompletedResponseDOCS } from './responses/docs/bad-request-goals-completed-response.docs';

import { UnauthorizedResponseDOCS } from 'src/shared/responses/docs/unauthorized-response.docs';
import { NotFoundUserOrGoalResponseDOCS } from 'src/shared/responses/docs/not-found-user-or-goal-response.docs';

import { type GoalCompleted } from './entities/goal-completed.entity';

import { GOALS_COMPLETED_SERVICE } from 'src/shared/constants/tokens';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDOCS,
})
@Controller('goals-completed')
export class GoalsCompletedController {
  constructor(
    @Inject(GOALS_COMPLETED_SERVICE)
    private readonly goalsCompletedService: GoalsCompletedService,
  ) {}

  @Get('total-quantity') async totalQuantity(
    @ActiveUserId() userId: string,
  ): Promise<{ totalQuantity: number }> {
    const totalQuantity =
      await this.goalsCompletedService.totalQuantity(userId);

    return { totalQuantity };
  }
  @ApiCreatedResponse({
    description: 'Returns the newly created goal completion record.',
    type: CreateGoalCompletedResponseDOCS,
  })
  @ApiBadRequestResponse({
    description: 'This goal has already been completed today.',
    type: BadRequestGoalsCompletedResponseDOCS,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the user or goal.',
    type: NotFoundUserOrGoalResponseDOCS,
  })
  @ApiConflictResponse({
    description: 'This goal has already reached its frequency this week.',
    type: ConflictGoalsCompletedResponseDOCS,
  })
  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createGoalCompletedDTO: CreateGoalCompletedDTO,
  ): Promise<GoalCompleted> {
    const { goalId } = createGoalCompletedDTO;

    return this.goalsCompletedService.create({ userId, goalId });
  }
}
