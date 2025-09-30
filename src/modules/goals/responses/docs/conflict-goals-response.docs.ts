import { ApiProperty } from '@nestjs/swagger';

export class ConflictGoalsResponseDOCS {
  @ApiProperty({
    example: 'Title already in use.',
    description: 'Error message.',
  })
  message: string;

  @ApiProperty({ example: 'Conflict', description: 'Error type.' })
  error: string;

  @ApiProperty({ example: 409, description: 'HTTP status code.' })
  statusCode: number;
}
