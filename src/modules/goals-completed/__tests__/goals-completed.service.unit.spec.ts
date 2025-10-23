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
  GOALS_SERVICE,
  USERS_SERVICE,
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
        { provide: USERS_SERVICE, useValue: UsersMockFactory.service },
        { provide: GOALS_SERVICE, useValue: GoalsMockFactory.service },
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

      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.service.findGoalById.success();

      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.success();

      GoalsCompletedMockFactory.responses.repository.create.success(
        mockGoalCompleted,
      );

      const goalCompleted = await goalsCompletedService.create({
        userId: mockGoal.userId,
        goalId: mockGoal.id!,
      });

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.service.findGoalById).toHaveBeenCalled();

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

      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.service.findGoalById.success();

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

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.service.findGoalById).toHaveBeenCalled();

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

      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.service.findGoalById.success();

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

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.service.findGoalById).toHaveBeenCalled();

      expect(GoalsCompletedMockFactory.repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockGoal2.userId,
          goalId: mockGoal2.id!,
          experiencePoints: 7,
        }),
      );
    });

    it('should to throw NotFound error when the goal does not exists', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.service.findGoalById.failure();

      await expect(
        goalsCompletedService.create({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.service.findGoalById).toHaveBeenCalled();

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).not.toHaveBeenCalled();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).not.toHaveBeenCalled();
    });

    it('should to throw BadRequest error when the goal has already been completed today', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.service.findGoalById.success();

      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.alreadyCompleted();

      await expect(
        goalsCompletedService.create({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.service.findGoalById).toHaveBeenCalled();

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).toHaveBeenCalled();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).not.toHaveBeenCalled();
    });

    it('should to throw Conflict error when the number of completions is equal to or greater than the frequency number', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.service.findGoalById.success();

      GoalsCompletedMockFactory.responses.repository.getGoalCompletedByDateAndByGoalId.success();

      GoalsMockFactory.responses.repository.getWeeklyFrequencyAndCompletionCount.conflict();

      await expect(
        goalsCompletedService.create({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
        }),
      ).rejects.toThrow(ConflictException);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.service.findGoalById).toHaveBeenCalled();

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).toHaveBeenCalled();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).toHaveBeenCalled();
    });

    it('should to throw an error when the user does not exist', async () => {
      UsersMockFactory.responses.service.findUserById.failure();

      await expect(
        goalsCompletedService.create({
          userId: mockGoal.userId,
          goalId: mockGoal.id!,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(GoalsMockFactory.service.findGoalById).not.toHaveBeenCalled();

      expect(
        GoalsCompletedMockFactory.repository.getGoalCompletedByDateAndByGoalId,
      ).not.toHaveBeenCalled();

      expect(
        GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount,
      ).not.toHaveBeenCalled();
    });
  });

  describe('totalQuantity', () => {
    it('should return total quantity of goals completed when has goals completed', async () => {
      const mockGoalsCompleted = Array.from({ length: 3 }, () =>
        GoalsCompletedMockFactory.create.goalCompleted({
          goalId: mockGoal.id!,
        }),
      );

      const completedGoalsCount = mockGoalsCompleted.length;

      UsersMockFactory.responses.service.findUserById.success();
      GoalsCompletedMockFactory.responses.repository.totalQuantity.success(
        completedGoalsCount,
      );

      const totalQuantity =
        await goalsCompletedService.totalQuantity(mockUserId);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(
        GoalsCompletedMockFactory.repository.totalQuantity,
      ).toHaveBeenCalled();
      expect(totalQuantity).toBe(completedGoalsCount);
    });

    it('should return 0 when has not goals completed', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsCompletedMockFactory.responses.repository.totalQuantity.success(0);

      const totalQuantity =
        await goalsCompletedService.totalQuantity(mockUserId);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(
        GoalsCompletedMockFactory.repository.totalQuantity,
      ).toHaveBeenCalled();
      expect(totalQuantity).toBe(0);
    });

    it('should to throw an error when the user does not exist', async () => {
      UsersMockFactory.responses.service.findUserById.failure();

      await expect(
        goalsCompletedService.totalQuantity(mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(
        GoalsCompletedMockFactory.repository.totalQuantity,
      ).not.toHaveBeenCalled();
    });
  });
});
