import { GoalCompleted } from '../entities/goal-completed.entity';

export abstract class GoalsCompletedRepository {
  abstract create({ goalId }: { goalId: string }): Promise<GoalCompleted>;
}
