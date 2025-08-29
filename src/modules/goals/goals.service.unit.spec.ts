import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { USERS_SERVICE } from '../users/users.service';

import {
  GOALS_REPOSITORY,
  GoalsRepository,
} from 'src/shared/contracts/goals.repository.contract';
import { GoalsService } from './goals.service';

import { Goal } from './entities/goal.entity';
import { WeeklyGoalsProgress } from 'src/shared/interfaces/goals/weekly-goals-progress.interface';
import { WeeklyGoalsSummary } from 'src/shared/interfaces/goals/weekly-goals-summary.interface';

import dayjs from 'dayjs';

describe('GoalsService', () => {
  let goalsService: GoalsService;
  let mockGoalsRepository: Partial<GoalsRepository>;

  let mockGetWeeklyGoalsWithCompletion: ReturnType<typeof vi.fn>;
  let mockGetWeeklySummaryOfGoalsCompletedByDay: ReturnType<typeof vi.fn>;
  let mockCreateGoal: ReturnType<typeof vi.fn>;

  let mockUserId: string;

  beforeEach(async () => {
    mockUserId = UsersMockFactory.createUserId();

    mockGoalsRepository = {
      getWeeklyGoalsWithCompletion: vi.fn(),
      getWeeklySummaryOfGoalsCompletedByDay: vi.fn(),
      create: vi.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GoalsService,
        { provide: USERS_SERVICE, useValue: UsersMockFactory.service },
        { provide: GOALS_REPOSITORY, useValue: mockGoalsRepository },
      ],
    }).compile();

    goalsService = module.get(GoalsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findWeeklyGoalsWithCompletion', () => {
    let weeklyGoalsProgress: WeeklyGoalsProgress[];

    beforeEach(() => {
      weeklyGoalsProgress = [
        {
          id: 'mock-goal',
          title: 'Acordar cedo',
          desiredWeeklyFrequency: 4,
          completionCount: 3,
        },
      ];

      mockGetWeeklyGoalsWithCompletion =
        mockGoalsRepository.getWeeklyGoalsWithCompletion as ReturnType<
          typeof vi.fn
        >;
    });

    it('should be able to return a goal with completion count', async () => {
      UsersMockFactory.serviceResponses().findUserByIdSuccess();
      mockGetWeeklyGoalsWithCompletion.mockResolvedValue(weeklyGoalsProgress);

      const goal = await goalsService.findWeeklyGoalsWithCompletion(mockUserId);

      const firstDayOfWeek = dayjs().startOf('week').toDate();
      const lastDayOfWeek = dayjs().endOf('week').toDate();

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(mockGetWeeklyGoalsWithCompletion).toHaveBeenCalledWith(
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

      expect(mockGetWeeklyGoalsWithCompletion).not.toHaveBeenCalled();
      await expect(
        goalsService.findWeeklyGoalsWithCompletion(mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findWeeklySummaryOfGoalsCompletedByDay', () => {
    let weeklyGoalsSummary: WeeklyGoalsSummary;

    beforeEach(() => {
      const startOfWeek = dayjs().startOf('week');

      const firstDayAnalysed = startOfWeek.format('YYYY-MM-DD');
      const secondDayAnalysed = startOfWeek.add(1, 'day');

      weeklyGoalsSummary = {
        completed: 1,
        total: 7,
        goalsPerDay: {
          [firstDayAnalysed]: [
            {
              id: 'mock-goal',
              title: 'Acordar cedo',
              completedAt: startOfWeek.toDate(),
            },
          ],
          [secondDayAnalysed.format('YYYY-MM-DD')]: [
            {
              id: 'mock-goal',
              title: 'Acordar cedo',
              completedAt: secondDayAnalysed.toDate(),
            },
          ],
        },
      };

      mockGetWeeklySummaryOfGoalsCompletedByDay =
        mockGoalsRepository.getWeeklySummaryOfGoalsCompletedByDay as ReturnType<
          typeof vi.fn
        >;
    });

    it('should be able to return a weekly summary of completed goals', async () => {
      UsersMockFactory.serviceResponses().findUserByIdSuccess();
      mockGetWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
        weeklyGoalsSummary,
      );

      const goal =
        await goalsService.findWeeklySummaryOfGoalsCompletedByDay(mockUserId);

      const firstDayOfWeek = dayjs().startOf('week').toDate();
      const lastDayOfWeek = dayjs().endOf('week').toDate();

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(mockGetWeeklySummaryOfGoalsCompletedByDay).toHaveBeenCalledWith(
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

      expect(mockGetWeeklySummaryOfGoalsCompletedByDay).not.toHaveBeenCalled();
      await expect(
        goalsService.findWeeklySummaryOfGoalsCompletedByDay(mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    let mockCreatedGoal: Goal;

    beforeEach(() => {
      const startOfWeek = dayjs().startOf('week');

      mockCreatedGoal = {
        id: 'mock-goal',
        userId: mockUserId,
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
        createdAt: startOfWeek.add(3, 'day').toDate(),
      };

      mockCreateGoal = (
        mockGoalsRepository.create as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCreatedGoal);
    });

    it('should be able to create a user and return it', async () => {
      UsersMockFactory.serviceResponses().findUserByIdSuccess();
      mockCreateGoal();

      const goal = await goalsService.create(mockUserId, {
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
      });

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(mockCreateGoal).toHaveBeenCalledWith(mockUserId, {
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
      });
      expect(goal).toEqual(mockCreatedGoal);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      UsersMockFactory.serviceResponses().findUserByIdFailure();

      expect(mockCreateGoal).not.toHaveBeenCalled();
      await expect(
        goalsService.create(mockUserId, {
          title: 'Estudar',
          desiredWeeklyFrequency: 7,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
