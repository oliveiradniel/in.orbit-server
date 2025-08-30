import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';

import { vi } from 'vitest';

export class GoalsCompletedMockFactory {
  static repository = {
    create: vi.fn(),
  };

  static create = {
    id: (id = 'goal-completed-id') => id,

    goalCompleted: () => ({
      id: GoalsCompletedMockFactory.create.id(),
      goalId: GoalsMockFactory.create.id(),
      createdAt: new Date('2025-08-30T00:00:00.000Z'),
    }),
  };

  static responses = {
    repository: {
      create: {
        success: () =>
          this.repository.create.mockResolvedValue(this.create.goalCompleted()),
      },
    },
  };
}
