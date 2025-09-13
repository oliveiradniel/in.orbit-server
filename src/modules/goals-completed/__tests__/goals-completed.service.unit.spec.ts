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
import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';

import {
  GOALS_COMPLETED_REPOSITORY,
  GOALS_REPOSITORY,
} from 'src/shared/constants/tokens';

describe('GoalsCompletedService', () => {
  let goalsCompletedService: GoalsCompletedService;

  let mockUserId: ReturnType<typeof UsersMockFactory.create.id>;
  let mockGoal: ReturnType<typeof GoalsMockFactory.create.goal>;

  beforeEach(async () => {
    mockUserId = UsersMockFactory.create.id();
    mockGoal = GoalsMockFactory.create.goal({ userId: mockUserId });

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
        userId: mockGoal.userId,
        goalId: mockGoal.id!,
      });

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          goalId: mockGoal.id!,
        }),
      );

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).toHaveBeenCalledWith(expect.objectContaining({ goalId: mockGoal.id! }));
      expect(GoalsCompletedMockFactory.repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
          experiencePoints: 5,
        }),
      );
      expect(goalCompleted).toEqual(mockGoalCompleted);
    });

    it('should add 5 XP when there is still 1 or more completions left in the week', async () => {
      const desiredWeeklyFrequency = 6;
      const countCompletion = 4;

      const mockGoal2 = GoalsMockFactory.create.goal({
        userId: mockUserId,
        desiredWeeklyFrequency,
      });

      const mockGoalCompleted = GoalsCompletedMockFactory.create.goalCompleted({
        goalId: mockGoal2.id!,
      });

      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.success(
        {
          desiredWeeklyFrequency,
          countCompletion,
        },
      );

      GoalsCompletedMockFactory.responses.repository.create.success(
        mockGoalCompleted,
      );

      await goalsCompletedService.create({
        userId: mockGoal2.userId,
        goalId: mockGoal2.id!,
      });

      expect(GoalsCompletedMockFactory.repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockGoal2.userId,
          goalId: mockGoal2.id!,
          experiencePoints: 5,
        }),
      );
    });

    it('should add 7 XP when this completion reaches the weekly frequency', async () => {
      const desiredWeeklyFrequency = 6;
      const countCompletion = 5;

      const mockGoal2 = GoalsMockFactory.create.goal({
        userId: mockUserId,
        desiredWeeklyFrequency,
      });

      const mockGoalCompleted = GoalsCompletedMockFactory.create.goalCompleted({
        goalId: mockGoal2.id!,
      });

      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.success(
        {
          desiredWeeklyFrequency,
          countCompletion,
        },
      );

      GoalsCompletedMockFactory.responses.repository.create.success(
        mockGoalCompleted,
      );

      await goalsCompletedService.create({
        userId: mockGoal2.userId,
        goalId: mockGoal2.id!,
      });

      expect(GoalsCompletedMockFactory.repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockGoal2.userId,
          goalId: mockGoal2.id!,
          experiencePoints: 7,
        }),
      );
    });

    it('should to throw NotFound error when the goal does not exists', async () => {
      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.null();

      await expect(
        goalsCompletedService.create({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
        }),
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
        goalsCompletedService.create({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
        }),
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
        goalsCompletedService.create({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
        }),
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
