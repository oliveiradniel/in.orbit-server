import { ApiProperty } from '@nestjs/swagger';

export class NotFoundGoalResponseDOCS {
  @ApiProperty({ example: 'Goal not found.', description: 'Error message.' })
  message: string;

  @ApiProperty({ example: 'Not Found.', description: 'Error type.' })
  error: string;

  @ApiProperty({ example: 404, description: 'HTTP status code.' })
  statusCode: number;
}
