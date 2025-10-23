import { vi } from 'vitest';

import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';
import { FakerFactory } from 'src/shared/__factories__/faker.factory';

import { type GoalCompleted } from '../entities/goal-completed.entity';

export class GoalsCompletedMockFactory {
  static repository = {
    create: vi.fn(),
    getGoalCompletedByDateAndByGoalId: vi.fn(),
    totalQuantity: vi.fn(),
  };

  static create = {
    id: (id = FakerFactory.data.uuid()): string => id,

    goalCompleted: (override: Partial<GoalCompleted> = {}): GoalCompleted => ({
      id: GoalsCompletedMockFactory.create.id(),
      goalId: GoalsMockFactory.create.id(),
      createdAt: new Date('2025-08-30T00:00:00.000Z'),
      ...override,
    }),
  };

  static responses = {
    repository: {
      create: {
        success: (override: Partial<GoalCompleted> = {}) =>
          GoalsCompletedMockFactory.repository.create.mockResolvedValue(
            GoalsCompletedMockFactory.create.goalCompleted(override),
          ),
      },
      getGoalCompletedByDateAndByGoalId: {
        success: () =>
          GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId.mockResolvedValue(
            null,
          ),
        alreadyCompleted: (override: Partial<GoalCompleted> = {}) =>
          GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId.mockResolvedValue(
            GoalsCompletedMockFactory.create.goalCompleted(override),
          ),
      },
      totalQuantity: {
        success: (quantity: number) =>
          GoalsCompletedMockFactory.repository.totalQuantity.mockResolvedValue(
            quantity,
          ),
      },
    },
  };
}
