import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalResponseDTO {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier of the created goal',
  })
  id: string;

  @ApiProperty({
    example: 'Acordar cedo',
    description: 'Title of the new goal',
  })
  title: string;

  @ApiProperty({
    example: 7,
    description: 'Number of times per week the goal should be completed',
  })
  desiredWeeklyFrequency: number;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Timestamp of creation',
  })
  createdAt: string;
}
