import { ApiProperty } from '@nestjs/swagger';

export class FindUserByIdResponseDTO {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: 'ce93bb46-90ec-4a61-a37f-e112908933e7',
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'Daniel Oliveira',
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'kadadniel@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'url',
    example: 'https://avatars.githubusercontent.com/u/189175871?v=4',
    description: 'Avatar URL of the user',
  })
  avatarURL: string;
}
