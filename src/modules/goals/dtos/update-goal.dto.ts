import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGoalDTO {
  @ApiProperty({
    example: 7,
    description: 'Desired weekly frequency for the goal',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => Number(value))
  desiredWeeklyFrequency: number;
}
