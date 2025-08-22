import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IsNotBlank } from 'src/shared/decorators/IsNotBlank';

export class CreateGoalDTO {
  @ApiProperty({ example: 'Acordar cedo', description: 'Goal title' })
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  title: string;

  @ApiProperty({ default: 1, example: 7, description: 'Frequency in the week' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(7)
  @IsNotEmpty()
  desiredWeeklyFrequency: number;
}
