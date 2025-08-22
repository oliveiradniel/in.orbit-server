import { Body, Controller, Post } from '@nestjs/common';

import { GoalsCompletedService } from './goals-completed.service';

import { CreateGoalCompletedDTO } from './dto/create-goal-completed.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('goals-completed')
export class GoalsCompletedController {
  constructor(private readonly goalsCompletedService: GoalsCompletedService) {}

  @ApiResponse({
    status: 201,
    description: 'Returns the newly created goal completion record',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Unique identifier of the completed goal',
          example: '8f995b05-60e9-40ee-92bc-1123489064e3',
        },
        goalId: {
          type: 'string',
          format: 'uuid',
          description: 'ID of the goal that was completed',
          example: 'cf6a0b3d-21f7-4cb0-a351-feb63fe3783d',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Timestamp when the goal was marked as completed',
          example: '2025-08-20T13:40:30.843Z',
        },
      },
      example: {
        id: '8f995b05-60e9-40ee-92bc-1123489064e3',
        goalId: 'cf6a0b3d-21f7-4cb0-a351-feb63fe3783d',
        createdAt: '2025-08-20T13:40:30.843Z',
      },
    },
  })
  @Post()
  create(@Body() createGoalCompletedDTO: CreateGoalCompletedDTO) {
    const { goalId } = createGoalCompletedDTO;

    return this.goalsCompletedService.create({ goalId });
  }
}
