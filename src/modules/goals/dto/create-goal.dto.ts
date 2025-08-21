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
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  title: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(7)
  @IsNotEmpty()
  desiredWeeklyFrequency: number;
}
