import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class GoalCompletedPerDayResponseDTO {
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Acordar cedo' })
  title: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  completedAt: string;
}

export class WeeklySummaryResponseDTO {
  @ApiProperty({
    example: 1,
    description: 'Total number of goals completed in the week',
  })
  completed: number;

  @ApiProperty({
    example: 7,
    description: 'Total number of goals available in the week',
  })
  total: number;

  @ApiProperty({
    description: 'Mapping of each day to its completed goals',
    example: {
      '2025-08-26': [
        {
          id: 'd6ecf894-3b89-4702-9307-c2cb7c9f1a27',
          title: 'Acordar cedo',
          completedAt: '2025-08-26T13:20:13.517',
        },
      ],
    },
    additionalProperties: {
      type: 'array',
      items: { $ref: getSchemaPath(GoalCompletedPerDayResponseDTO) },
    },
  })
  goalsPerDay: Record<string, GoalCompletedPerDayResponseDTO[]>;
}
