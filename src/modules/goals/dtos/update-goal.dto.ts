import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGoalDTO {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => Number(value))
  desiredWeeklyFrequency: number;
}
