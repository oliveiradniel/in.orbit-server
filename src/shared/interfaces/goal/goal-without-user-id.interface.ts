import { Goal } from 'src/modules/goals/entities/goal.entity';

export type GoalWithoutUserId = Omit<Goal, 'userId'>;

export interface GoalsWithTotal {
  goals: GoalWithoutUserId[];
  total: number;
}
