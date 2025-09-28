import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GoalIdParam {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '0d935d96-e5cd-4633-8246-4df16d96190e',
    description: 'Unique identifier of the goal to update',
  })
  @IsUUID()
  @IsNotEmpty()
  goalId: string;
}
