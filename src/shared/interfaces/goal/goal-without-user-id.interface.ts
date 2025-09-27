import { Goal } from 'src/modules/goals/entities/goal.entity';

type GoalWithoutUserId = Omit<Goal, 'userId'>;

export interface GoalWithTotal {
  goals: GoalWithoutUserId[];
  total: number;
}
