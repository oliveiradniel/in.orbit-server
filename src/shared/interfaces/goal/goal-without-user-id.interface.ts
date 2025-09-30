import { Goal } from 'src/modules/goals/entities/goal.entity';

export type GoalWithoutUserIdAndIsDeleted = Omit<Goal, 'userId' | 'isDeleted'>;

export interface GoalsWithTotal {
  goals: GoalWithoutUserIdAndIsDeleted[];
  total: number;
}
