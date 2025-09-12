import { type GoalCompleted } from '../entities/goal-completed.entity';
import { type GoalCompletedDateFilter } from 'src/shared/database/interfaces/goal-completed/goal-completed-date-filter.interface';

export abstract class GoalsCompletedRepository {
  abstract getGoalCompletedByDateAndByGoalId(
    params: GoalCompletedDateFilter,
  ): Promise<GoalCompleted | null>;

  abstract create(params: { goalId: string }): Promise<GoalCompleted>;
}
