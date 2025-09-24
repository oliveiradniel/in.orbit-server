import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class FindWeeklySummaryOfCompletedGoalsDTO {
  @IsDate()
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value ? new Date(value) : undefined,
  )
  weekStartsAt: Date;
}
