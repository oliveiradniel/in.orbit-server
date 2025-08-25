import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateGitHubDTO {
  @ApiProperty({
    example: '3c6fde8098eb6d0954d5',
    description: 'Code provided by GitHub.',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
