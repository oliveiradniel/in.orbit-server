import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

import dayjs from 'dayjs';

export class FindWeeklySummaryOfCompletedGoalsDTO {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  weekStartsAt: Date = dayjs().startOf('week').toDate();
}
