import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import dayjs from 'dayjs';

export class FindWeeklySummaryOfCompletedGoalsDTO {
  @IsDate()
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    if (!value) {
      return dayjs().startOf('week').startOf('day').toDate();
    }
    return new Date(value);
  })
  weekStartsAt: Date;
}
