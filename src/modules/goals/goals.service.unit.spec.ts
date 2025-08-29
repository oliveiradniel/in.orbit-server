import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { USERS_SERVICE, UsersService } from '../users/users.service';

import {
  GOALS_REPOSITORY,
  GoalsRepository,
} from 'src/shared/contracts/goals.repository.contract';
import { GoalsService } from './goals.service';

import dayjs from 'dayjs';

import { User } from '../users/entities/user.entity';
import { Goal } from './entities/goal.entity';
import { WeeklyGoalsProgress } from 'src/shared/interfaces/goals/weekly-goals-progress.interface';
import { WeeklyGoalsSummary } from 'src/shared/interfaces/goals/weekly-goals-summary.interface';

describe('GoalsService', () => {
  let goalsService: GoalsService;
  let mockUsersService: Pick<UsersService, 'findUserById'>;
  let mockGoalsRepository: Partial<GoalsRepository>;

  let mockFindUserByIdSuccess: ReturnType<typeof vi.fn>;
  let mockFindUserByIdFailure: () => ReturnType<typeof vi.fn>;

  let mockGetWeeklyGoalsWithCompletion: ReturnType<typeof vi.fn>;
  let mockGetWeeklySummaryOfGoalsCompletedByDay: ReturnType<typeof vi.fn>;
  let mockCreateGoal: ReturnType<typeof vi.fn>;

  let userId: string;
  let mockUser: User;

  beforeEach(async () => {
    userId = 'john-doe';
    mockUser = {
      id: 'john-doe',
      avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
      externalAccountId: 1232143123,
    };

    mockUsersService = {
      findUserById: vi.fn(),
    };

    const mockFindUserById = mockUsersService.findUserById as ReturnType<
      typeof vi.fn
    >;

    mockFindUserByIdSuccess = mockFindUserById.mockResolvedValue(mockUser);
    mockFindUserByIdFailure = () =>
      mockFindUserById.mockRejectedValue(new NotFoundException());

    mockGoalsRepository = {
      getWeeklyGoalsWithCompletion: vi.fn(),
      getWeeklySummaryOfGoalsCompletedByDay: vi.fn(),
      create: vi.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GoalsService,
        { provide: USERS_SERVICE, useValue: mockUsersService },
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
      mockFindUserByIdSuccess();
      mockGetWeeklyGoalsWithCompletion.mockResolvedValue(weeklyGoalsProgress);

      const goal = await goalsService.findWeeklyGoalsWithCompletion(userId);

      const firstDayOfWeek = dayjs().startOf('week').toDate();
      const lastDayOfWeek = dayjs().endOf('week').toDate();

      expect(mockFindUserByIdSuccess).toHaveBeenCalledWith(userId);
      expect(mockGetWeeklyGoalsWithCompletion).toHaveBeenCalledWith(
        expect.objectContaining({ userId, lastDayOfWeek, firstDayOfWeek }),
      );
      expect(goal).toEqual(weeklyGoalsProgress);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      mockFindUserByIdFailure();

      expect(mockGetWeeklyGoalsWithCompletion).not.toHaveBeenCalled();
      await expect(
        goalsService.findWeeklyGoalsWithCompletion(userId),
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
      mockFindUserByIdSuccess();
      mockGetWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
        weeklyGoalsSummary,
      );

      const goal =
        await goalsService.findWeeklySummaryOfGoalsCompletedByDay(userId);

      const firstDayOfWeek = dayjs().startOf('week').toDate();
      const lastDayOfWeek = dayjs().endOf('week').toDate();

      expect(mockFindUserByIdSuccess).toHaveBeenCalledWith(userId);
      expect(mockGetWeeklySummaryOfGoalsCompletedByDay).toHaveBeenCalledWith(
        expect.objectContaining({ userId, lastDayOfWeek, firstDayOfWeek }),
      );
      expect(goal).toEqual(weeklyGoalsSummary);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      mockFindUserByIdFailure();

      expect(mockGetWeeklySummaryOfGoalsCompletedByDay).not.toHaveBeenCalled();
      await expect(
        goalsService.findWeeklySummaryOfGoalsCompletedByDay(userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    let mockCreatedGoal: Goal;

    beforeEach(() => {
      const startOfWeek = dayjs().startOf('week');

      mockCreatedGoal = {
        id: 'mock-goal',
        userId,
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
        createdAt: startOfWeek.add(3, 'day').toDate(),
      };

      mockCreateGoal = (
        mockGoalsRepository.create as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCreatedGoal);
    });

    it('should be able to create a user and return it', async () => {
      mockFindUserByIdSuccess();
      mockCreateGoal();

      const goal = await goalsService.create(userId, {
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
      });

      expect(mockFindUserByIdSuccess).toHaveBeenCalledWith(userId);
      expect(mockCreateGoal).toHaveBeenCalledWith(userId, {
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
      });
      expect(goal).toEqual(mockCreatedGoal);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      mockFindUserByIdFailure();

      expect(mockCreateGoal).not.toHaveBeenCalled();
      await expect(
        goalsService.create(userId, {
          title: 'Estudar',
          desiredWeeklyFrequency: 7,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
