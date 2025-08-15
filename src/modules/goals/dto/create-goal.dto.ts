import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateGoalDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(7)
  @IsNotEmpty()
  desiredWeeklyFrequency: number;
}
