import { GoalCompleted } from '../entities/goal-completed.entity';

export const GOALS_COMPLETED_REPOSITORY = Symbol('GOALS_COMPLETED_REPOSITORY');

export abstract class GoalsCompletedRepository {
  abstract create({ goalId }: { goalId: string }): Promise<GoalCompleted>;
}
