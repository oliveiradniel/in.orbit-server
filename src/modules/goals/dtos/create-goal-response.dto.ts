import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalResponseDTO {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '0d935d96-e5cd-4633-8246-4df16d96190e',
    description: 'Unique identifier of the created goal',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '9542f240-5923-4a18-b356-a490ee858ef7',
    description: 'Unique identifier of the user',
  })
  userId: string;

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
