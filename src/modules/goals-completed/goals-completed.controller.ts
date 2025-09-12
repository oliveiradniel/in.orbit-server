import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GoalsCompletedService } from './goals-completed.service';

import { CreateGoalCompletedDTO } from './dtos/create-goal-completed.dto';
import { CreateGoalCompletedResponseDTO } from './dtos/create-goal-completed-response.dto';

import { UnauthorizedResponseDTO } from 'src/shared/dtos/unauthorized-response.dto';
import { NotFoundGoalResponseDTO } from 'src/shared/dtos/not-found-goal-response.dto';
import { ConflictResponseDTO } from './dtos/conflict-response.dto';
import { BadRequestResponseDTO } from './dtos/bad-request-response.dto';

import { type GoalCompleted } from './entities/goal-completed.entity';

import { GOALS_COMPLETED_SERVICE } from 'src/shared/constants/tokens';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDTO,
})
@Controller('goals-completed')
export class GoalsCompletedController {
  constructor(
    @Inject(GOALS_COMPLETED_SERVICE)
    private readonly goalsCompletedService: GoalsCompletedService,
  ) {}

  @ApiCreatedResponse({
    description: 'Returns the newly created goal completion record',
    type: CreateGoalCompletedResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'This goal has already been completed today.',
    type: BadRequestResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the goal.',
    type: NotFoundGoalResponseDTO,
  })
  @ApiConflictResponse({
    description: 'This goal has already reached its frequency this week.',
    type: ConflictResponseDTO,
  })
  @Post()
  create(
    @Body() createGoalCompletedDTO: CreateGoalCompletedDTO,
  ): Promise<GoalCompleted> {
    const { goalId } = createGoalCompletedDTO;

    return this.goalsCompletedService.create({ goalId });
  }
}
