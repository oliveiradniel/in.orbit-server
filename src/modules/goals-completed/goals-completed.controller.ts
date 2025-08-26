import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GoalsCompletedService } from './goals-completed.service';

import { CreateGoalCompletedDTO } from './dtos/create-goal-completed.dto';
import { CreateGoalCompletedResponseDTO } from './dtos/create-goal-completed-response.dto';

import { UnauthorizedResponseDTO } from 'src/shared/dtos/unauthorized-response.dto';
import { NotFoundGoalResponseDTO } from 'src/shared/dtos/not-found-goal-response.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDTO,
})
@Controller('goals-completed')
export class GoalsCompletedController {
  constructor(private readonly goalsCompletedService: GoalsCompletedService) {}

  @ApiCreatedResponse({
    description: 'Returns the newly created goal completion record',
    type: CreateGoalCompletedResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the goal.',
    type: NotFoundGoalResponseDTO,
  })
  @Post()
  create(@Body() createGoalCompletedDTO: CreateGoalCompletedDTO) {
    const { goalId } = createGoalCompletedDTO;

    return this.goalsCompletedService.create({ goalId });
  }
}
