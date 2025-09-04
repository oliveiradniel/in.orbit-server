import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GoalsCompletedService } from '../goals-completed.service';

import { GoalsCompletedMockFactory } from '../__factories__/goals-completed-mock.factory';
import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';

import {
  GOALS_COMPLETED_REPOSITORY,
  GOALS_REPOSITORY,
} from 'src/shared/constants/tokens';

describe('GoalsCompletedService', () => {
  let goalsCompletedService: GoalsCompletedService;

  let mockGoalId: ReturnType<typeof GoalsMockFactory.create.id>;
  let mockGoalCompleted: ReturnType<
    typeof GoalsCompletedMockFactory.create.goalCompleted
  >;

  beforeEach(async () => {
    mockGoalId = GoalsMockFactory.create.id();
    mockGoalCompleted = GoalsCompletedMockFactory.create.goalCompleted();

    const module = await Test.createTestingModule({
      providers: [
        GoalsCompletedService,
        {
          provide: GOALS_COMPLETED_REPOSITORY,
          useValue: GoalsCompletedMockFactory.repository,
        },
        { provide: GOALS_REPOSITORY, useValue: GoalsMockFactory.repository },
      ],
    }).compile();

    goalsCompletedService = module.get(GoalsCompletedService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should be able to create a goal and return it', async () => {
      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.success();
      GoalsCompletedMockFactory.responses.repository.create.success();

      const goalCompleted = await goalsCompletedService.create({
        goalId: mockGoalId,
      });

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          goalId: mockGoalId,
        }),
      );
      expect(GoalsCompletedMockFactory.repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          goalId: mockGoalId,
        }),
      );
      expect(goalCompleted).toEqual(mockGoalCompleted);
    });

    it('should be able to throw an error when the goal does not exists', async () => {
      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.null();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).not.toHaveBeenCalled();
      await expect(
        goalsCompletedService.create({ goalId: mockGoalId }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should be able to throw an error when the number of completions is equal to or greater than the frequency number', async () => {
      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.conflict();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).not.toHaveBeenCalled();
      await expect(
        goalsCompletedService.create({ goalId: mockGoalId }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
