import { CreateGoalDTO } from 'src/modules/goals/dtos/create-goal.dto';

import { type Goal } from 'src/modules/goals/entities/goal.entity';
import {
  type GoalDateRangeFilter,
  type UserDateRangeFilter,
} from '../database/interfaces/goal/range-filters.interfaces';
import { type WeeklyGoalsProgress } from '../interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from '../interfaces/goal/weekly-goals-summary.interface';
import { type GoalProgressMetric } from '../interfaces/goal/goal-progress-metric.interface';
import { type GoalWithTotal } from '../interfaces/goal/goal-without-user-id.interface';

export abstract class GoalsRepository {
  abstract getWeeklyGoalsWithCompletion(
    params: UserDateRangeFilter,
  ): Promise<WeeklyGoalsProgress[]>;

  abstract getWeeklySummaryOfGoalsCompletedByDay(
    params: UserDateRangeFilter,
  ): Promise<WeeklyGoalsSummary>;

  abstract getWeeklyFrequencyAndCompletionCount(
    params: GoalDateRangeFilter,
  ): Promise<GoalProgressMetric | null>;

  abstract getAllByUserId(userId: string): Promise<GoalWithTotal>;

  abstract create(userId: string, createGoalDTO: CreateGoalDTO): Promise<Goal>;
}
