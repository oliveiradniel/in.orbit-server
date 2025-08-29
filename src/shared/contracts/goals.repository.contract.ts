import { Goal } from 'src/modules/goals/entities/goal.entity';

import { CreateGoalDTO } from 'src/modules/goals/dtos/create-goal.dto';

import { type UserDateRangeFilter } from 'src/shared/interfaces/goals/user-date-range-filter.interface';
import { type GoalDateRangeFilter } from 'src/shared/interfaces/goals/goal-date-range-filter.interface';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goals/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from 'src/shared/interfaces/goals/weekly-goals-summary.interface';
import { type WeeklyGoalProgress } from 'src/shared/interfaces/goals/weekly-goal-progress.interface';

export const GOALS_REPOSITORY = Symbol('GOALS_REPOSITORY');

export abstract class GoalsRepository {
  abstract getWeeklyGoalsWithCompletion({
    userId,
    lastDayOfWeek,
    firstDayOfWeek,
  }: UserDateRangeFilter): Promise<WeeklyGoalsProgress[]>;

  abstract getWeeklySummaryOfGoalsCompletedByDay({
    userId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: UserDateRangeFilter): Promise<WeeklyGoalsSummary>;

  abstract getWeeklyFrequencyAndCompletionCount({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalDateRangeFilter): Promise<WeeklyGoalProgress | null>;

  abstract create(userId: string, createGoalDTO: CreateGoalDTO): Promise<Goal>;
}
