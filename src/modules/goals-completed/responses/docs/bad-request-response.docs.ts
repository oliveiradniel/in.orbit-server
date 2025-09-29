import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDOCS {
  @ApiProperty({
    example: 'This goal has already been completed today.',
    description: 'Error message.',
  })
  message: string;

  @ApiProperty({ example: 'Bad Request', description: 'Error type.' })
  error: string;

  @ApiProperty({ example: 400, description: 'HTTP status code.' })
  statusCode: number;
}
