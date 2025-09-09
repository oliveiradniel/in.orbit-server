import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

import dayjs from 'dayjs';

export class FindWeeklySummaryOfCompletedGoalsDTO {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  weekStartsAt: Date = dayjs().startOf('week').startOf('day').toDate();
}
