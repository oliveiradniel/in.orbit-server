import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDOCS {
  @ApiProperty({
    example: 'Invalid GitHub code or token not received.',
    description: 'Error message.',
  })
  message: string;

  @ApiProperty({
    example: 'Bad Request.',
    description: 'Error type.',
  })
  error: string;

  @ApiProperty({
    example: 400,
    description: 'HTTP status code.',
  })
  statusCode: number;
}
