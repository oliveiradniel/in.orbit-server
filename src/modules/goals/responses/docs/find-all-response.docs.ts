import { ApiProperty } from '@nestjs/swagger';

import { type GoalWithoutUserIdAndIsDeleted } from 'src/shared/interfaces/goal/goal-without-user-id.interface';

export class FindAllResponseDOCS {
  @ApiProperty({
    example: [
      {
        id: '0e2be680-88e2-471c-9a32-203066c4848f',
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 7,
        createdAt: '2025-09-13T22:55:40.717Z',
      },
      {
        id: '743bd405-45c4-49a5-a3cc-27e9279b7f11',
        title: 'Estudar',
        desiredWeeklyFrequency: 5,
        createdAt: '2025-09-13T22:56:14.656Z',
      },
    ],
    description: 'List of goals that belong to the authenticated user.',
  })
  goals: GoalWithoutUserIdAndIsDeleted[];

  @ApiProperty({
    example: 2,
    description: 'Total number of goals found for the authenticated user.',
  })
  total: number;
}
