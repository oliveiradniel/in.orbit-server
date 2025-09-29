import { Body, Controller, Inject, Post } from '@nestjs/common';
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
import { ConflictResponseDOCS } from './responses/docs/conflict-response.docs';
import { BadRequestResponseDOCS } from './responses/docs/bad-request-response.docs';

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

  @ApiCreatedResponse({
    description: 'Returns the newly created goal completion record.',
    type: CreateGoalCompletedResponseDOCS,
  })
  @ApiBadRequestResponse({
    description: 'This goal has already been completed today.',
    type: BadRequestResponseDOCS,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the user or goal.',
    type: NotFoundUserOrGoalResponseDOCS,
  })
  @ApiConflictResponse({
    description: 'This goal has already reached its frequency this week.',
    type: ConflictResponseDOCS,
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
