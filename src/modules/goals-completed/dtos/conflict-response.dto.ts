import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponseDTO {
  @ApiProperty({
    example: 'Goal already completed this week.',
    description: 'Error message',
  })
  message: string;

  @ApiProperty({ example: 'Conflict', description: 'Error type' })
  error: string;

  @ApiProperty({ example: 409, description: 'HTTP status code' })
  statusCode: number;
}
