import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

//FindWeeklySummaryOfCompletedGoalsQuery
export class WeekStartsAtQuery {
  @IsDate()
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value ? new Date(value) : undefined,
  )
  weekStartsAt: Date;
}
