import { type GoalCompleted } from '../entities/goal-completed.entity';

export abstract class GoalsCompletedRepository {
  abstract create(params: { goalId: string }): Promise<GoalCompleted>;
}
