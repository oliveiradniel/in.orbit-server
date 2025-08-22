import { Body, Controller, Get, Post } from '@nestjs/common';

import { GoalsService } from './goals.service';

import { CreateGoalDTO } from './dto/create-goal.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @ApiResponse({
    status: 200,
    description:
      'Returns a list of all goals with their weekly completion count',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier of the goal',
          },
          title: {
            type: 'string',
            example: 'Acordar cedo',
            description: 'Title of the goal',
          },
          desiredWeeklyFrequency: {
            type: 'number',
            example: 5,
            description: 'How many times per week the goal should be completed',
          },
          completionCount: {
            type: 'number',
            example: 3,
            description:
              'Number of times the goal has been completed so far this week',
          },
        },
        required: ['id', 'title', 'desiredWeeklyFrequency', 'completionCount'],
      },
      example: [
        {
          id: '4ef229f0-a3ac-4eb8-9f59-35e19b68728c',
          title: 'Acordar cedo',
          desiredWeeklyFrequency: 5,
          completionCount: 3,
        },
        {
          id: 'aa579ef9-6faf-4f14-8187-1426956476b2',
          title: 'Me exercitar',
          desiredWeeklyFrequency: 3,
          completionCount: 2,
        },
        {
          id: '3b414877-2004-465a-8588-4df701551f57',
          title: 'Meditar',
          desiredWeeklyFrequency: 1,
          completionCount: 1,
        },
      ],
    },
  })
  @Get()
  findWeeklyGoalsWithCompletion() {
    return this.goalsService.findWeeklyGoalsWithCompletion();
  }

  @ApiResponse({
    status: 200,
    description:
      'Returns the weekly progress summary, including the total goals and the list of goals completed per day.',
    schema: {
      type: 'object',
      properties: {
        completed: {
          type: 'number',
          example: 4,
          description: 'Total number of goals completed in the week',
        },
        total: {
          type: 'number',
          example: 9,
          description: 'Total number of goals available in the week',
        },
        goalsPerDay: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string', example: 'Acordar cedo' },
                completedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          description: 'Mapping of each day to its completed goals',
        },
      },
      example: {
        completed: 4,
        total: 9,
        goalsPerDay: {
          '2025-08-19': [
            {
              id: 'd911db4d-9b6e-4072-ab63-ce73c90a4d67',
              title: 'Acordar cedo',
              completedAt: '2025-08-19T03:00:00',
            },
          ],
          '2025-08-18': [
            {
              id: 'd8dd8d4d-88a5-45d4-ba1b-07a40d23c715',
              title: 'Acordar cedo',
              completedAt: '2025-08-18T03:00:00',
            },
            {
              id: 'd997cb7b-38f1-41c3-b764-dba433a72710',
              title: 'Meditar',
              completedAt: '2025-08-18T03:00:00',
            },
          ],
          '2025-08-17': [
            {
              id: 'd3553e53-dbfc-4b60-aad3-b3e0b827595c',
              title: 'Acordar cedo',
              completedAt: '2025-08-17T03:00:00',
            },
          ],
        },
      },
    },
  })
  @Get('summary')
  async findWeeklySummaryOfCompletedGoals() {
    const summary =
      await this.goalsService.findWeeklySummaryOfGoalsCompletedByDay();

    return summary[0];
  }

  @ApiResponse({
    status: 201,
    description:
      'Successfully creates a new goal and returns the created goal object',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Unique identifier of the created goal',
        },
        title: {
          type: 'string',
          example: 'Acordar cedo',
          description: 'Title of the new goal',
        },
        desiredWeeklyFrequency: {
          type: 'number',
          example: 7,
          description: 'Number of times per week the goal should be completed',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-15T19:13:42.909Z',
          description: 'Timestamp of when the goal was created',
        },
      },
      required: ['id', 'title', 'desiredWeeklyFrequency', 'createdAt'],
      example: {
        id: '1b13572a-1957-4020-8e2c-e8988117cd61',
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 7,
        createdAt: '2025-08-15T19:13:42.909Z',
      },
    },
  })
  @Post()
  create(@Body() createGoalDTO: CreateGoalDTO) {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.goalsService.create({
      title,
      desiredWeeklyFrequency,
    });
  }
}
