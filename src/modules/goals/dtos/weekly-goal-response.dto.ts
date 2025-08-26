import { ApiProperty } from '@nestjs/swagger';

export class WeeklyGoalResponseDTO {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier of the goal',
  })
  id: string;

  @ApiProperty({ example: 'Acordar cedo', description: 'Title of the goal' })
  title: string;

  @ApiProperty({
    example: 5,
    description: 'How many times per week the goal should be completed',
  })
  desiredWeeklyFrequency: number;

  @ApiProperty({
    example: 3,
    description: 'Number of times the goal has been completed this week',
  })
  completionCount: number;
}
