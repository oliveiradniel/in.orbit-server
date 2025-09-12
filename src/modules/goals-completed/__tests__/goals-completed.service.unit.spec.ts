import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

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

  beforeEach(async () => {
    mockGoalId = GoalsMockFactory.create.id();

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

    goalsCompletedService = module.get<GoalsCompletedService>(
      GoalsCompletedService,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should to create a goal and return it', async () => {
      const mockGoalCompleted =
        GoalsCompletedMockFactory.create.goalCompleted();

      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.success();

      GoalsCompletedMockFactory.responses.repository.create.success(
        mockGoalCompleted,
      );

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

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).toHaveBeenCalledWith(expect.objectContaining({ goalId: mockGoalId }));
      expect(GoalsCompletedMockFactory.repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          goalId: mockGoalId,
        }),
      );
      expect(goalCompleted).toEqual(mockGoalCompleted);
    });

    it('should to throw NotFound error when the goal does not exists', async () => {
      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.null();

      await expect(
        goalsCompletedService.create({ goalId: mockGoalId }),
      ).rejects.toThrow(NotFoundException);

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).toHaveBeenCalled();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).toHaveBeenCalled();
    });

    it('should to throw BadRequest error when the goal has already been completed today', async () => {
      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.alreadyCompleted();

      await expect(
        goalsCompletedService.create({ goalId: mockGoalId }),
      ).rejects.toThrow(BadRequestException);

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).toHaveBeenCalled();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).not.toHaveBeenCalled();
    });

    it('should to throw Conflict error when the number of completions is equal to or greater than the frequency number', async () => {
      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.conflict();

      await expect(
        goalsCompletedService.create({ goalId: mockGoalId }),
      ).rejects.toThrow(ConflictException);

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).toHaveBeenCalled();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).toHaveBeenCalled();
    });
  });
});
