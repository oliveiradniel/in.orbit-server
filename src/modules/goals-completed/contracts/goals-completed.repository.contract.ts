import { type GoalCompleted } from '../entities/goal-completed.entity';
import { type GoalCompletedDateFilter } from 'src/shared/database/interfaces/goal-completed/goal-completed-date-filter.interface';
import { type CreateGoalCompleted } from 'src/shared/database/interfaces/goal-completed/create-goal-completed.interface';

export abstract class GoalsCompletedRepository {
  abstract getGoalCompletedByDateAndByGoalId(
    params: GoalCompletedDateFilter,
  ): Promise<GoalCompleted | null>;

  abstract create(params: CreateGoalCompleted): Promise<GoalCompleted>;

  abstract totalQuantity(userId: string): Promise<number>;
}
