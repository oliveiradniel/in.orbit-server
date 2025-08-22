import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGoalCompletedDTO {
  @ApiProperty({
    example: 'cf6a0b3d-21f7-4cb0-a351-feb63fe3783d',
    description: 'Goal id',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  goalId: string;
}
