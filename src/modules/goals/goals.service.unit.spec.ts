import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { USERS_SERVICE } from '../users/users.service';

import { GoalsService } from './goals.service';
import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';
import { GOALS_REPOSITORY } from 'src/shared/contracts/goals.repository.contract';

import dayjs from 'dayjs';

describe('GoalsService', () => {
  let goalsService: GoalsService;

  let mockUserId: ReturnType<typeof UsersMockFactory.createUserId>;

  beforeEach(async () => {
    mockUserId = UsersMockFactory.createUserId();

    const module = await Test.createTestingModule({
      providers: [
        GoalsService,
        { provide: USERS_SERVICE, useValue: UsersMockFactory.service },
        { provide: GOALS_REPOSITORY, useValue: GoalsMockFactory.repository },
      ],
    }).compile();

    goalsService = module.get(GoalsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findWeeklyGoalsWithCompletion', () => {
    const weeklyGoalsProgress = GoalsMockFactory.create.weeklyGoalsProgress();

    it('should be able to return a goal with completion count', async () => {
      UsersMockFactory.serviceResponses().findUserByIdSuccess();
      GoalsMockFactory.responses.repository.getWeeklyGoalsWithCompletionSuccess();

      const goal = await goalsService.findWeeklyGoalsWithCompletion(mockUserId);

      const firstDayOfWeek = dayjs().startOf('week').toDate();
      const lastDayOfWeek = dayjs().endOf('week').toDate();

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(
        GoalsMockFactory.repository.getWeeklyGoalsWithCompletion,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          lastDayOfWeek,
          firstDayOfWeek,
        }),
      );
      expect(goal).toEqual(weeklyGoalsProgress);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      UsersMockFactory.serviceResponses().findUserByIdFailure();

      expect(
        GoalsMockFactory.repository.getWeeklyGoalsWithCompletion,
      ).not.toHaveBeenCalled();
      await expect(
        goalsService.findWeeklyGoalsWithCompletion(mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findWeeklySummaryOfGoalsCompletedByDay', () => {
    const weeklyGoalsSummary = GoalsMockFactory.create.weeklyGoalsSummary();

    it('should be able to return a weekly summary of completed goals', async () => {
      UsersMockFactory.serviceResponses().findUserByIdSuccess();
      GoalsMockFactory.responses.repository.getWeeklySummaryOfGoalsCompletedByDaySuccess();

      const goal =
        await goalsService.findWeeklySummaryOfGoalsCompletedByDay(mockUserId);

      const firstDayOfWeek = dayjs().startOf('week').toDate();
      const lastDayOfWeek = dayjs().endOf('week').toDate();

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(
        GoalsMockFactory.repository.getWeeklySummaryOfGoalsCompletedByDay,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          lastDayOfWeek,
          firstDayOfWeek,
        }),
      );
      expect(goal).toEqual(weeklyGoalsSummary);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      UsersMockFactory.serviceResponses().findUserByIdFailure();

      expect(
        GoalsMockFactory.repository.getWeeklySummaryOfGoalsCompletedByDay,
      ).not.toHaveBeenCalled();
      await expect(
        goalsService.findWeeklySummaryOfGoalsCompletedByDay(mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const mockGoal = GoalsMockFactory.create.goal();

    it('should be able to create a user and return it', async () => {
      UsersMockFactory.serviceResponses().findUserByIdSuccess();
      GoalsMockFactory.responses.repository.createGoalSuccess();

      const goal = await goalsService.create(mockUserId, {
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
      });

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(GoalsMockFactory.repository.create).toHaveBeenCalledWith(
        mockUserId,
        {
          title: 'Estudar',
          desiredWeeklyFrequency: 7,
        },
      );
      expect(goal).toEqual(mockGoal);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      UsersMockFactory.serviceResponses().findUserByIdFailure();

      expect(GoalsMockFactory.repository.create).not.toHaveBeenCalled();
      await expect(
        goalsService.create(mockUserId, {
          title: 'Estudar',
          desiredWeeklyFrequency: 7,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
