import { CreateGoalDTO } from 'src/modules/goals/dtos/create-goal.dto';

import { type Goal } from 'src/modules/goals/entities/goal.entity';
import {
  type GoalDateRangeFilter,
  type UserDateRangeFilter,
} from '../database/interfaces/goal/range-filters.interfaces';
import { type WeeklyGoalsProgress } from '../interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from '../interfaces/goal/weekly-goals-summary.interface';
import { type GoalProgressMetric } from '../interfaces/goal/goal-progress-metric.interface';
import { type GoalsWithTotal } from '../interfaces/goal/goal-without-user-id.interface';
import { type DataToUpdateGoal } from '../database/interfaces/goal/data-to-update-goal.interface';
import { type DataToDeleteGoals } from '../database/interfaces/goal/data-to-delete-goals.interface';

export abstract class GoalsRepository {
  abstract getGoalById(goalId: string): Promise<Goal | null>;

  abstract getGoalByTitle(userId: string, title: string): Promise<Goal | null>;

  abstract getWeeklyGoalsWithCompletion(
    params: UserDateRangeFilter,
  ): Promise<WeeklyGoalsProgress[]>;

  abstract getWeeklySummaryOfGoalsCompletedByDay(
    params: UserDateRangeFilter,
  ): Promise<WeeklyGoalsSummary>;

  abstract getWeeklyFrequencyAndCompletionCount(
    params: GoalDateRangeFilter,
  ): Promise<GoalProgressMetric | null>;

  abstract getAllByUserId(userId: string): Promise<GoalsWithTotal>;

  abstract create(userId: string, createGoalDTO: CreateGoalDTO): Promise<Goal>;

  abstract update(dataToUpdateGoal: DataToUpdateGoal): Promise<Goal>;

  abstract deleteGoals(dataToDeleteGoals: DataToDeleteGoals): Promise<void>;
}
