import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalCompletedResponseDOCS {
  @ApiProperty({
    description: 'Unique identifier of the completed goal.',
    format: 'uuid',
    example: '8f995b05-60e9-40ee-92bc-1123489064e3',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the goal that was completed.',
    format: 'uuid',
    example: 'cf6a0b3d-21f7-4cb0-a351-feb63fe3783d',
  })
  goalId: string;

  @ApiProperty({
    description: 'Timestamp when the goal was marked as completed.',
    format: 'date-time',
    example: '2025-08-20T13:40:30.843Z',
  })
  createdAt: string;
}
