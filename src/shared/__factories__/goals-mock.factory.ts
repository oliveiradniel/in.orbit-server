import { UsersMockFactory } from './users-mock.factory';
import { FakerFactory } from './faker.factory';

import { type Goal } from 'src/modules/goals/entities/goal.entity';
import { type WeeklyGoalsProgress } from '../interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from '../interfaces/goal/weekly-goals-summary.interface';
import { type GoalProgressMetric } from '../interfaces/goal/goal-progress-metric.interface';

import { vi } from 'vitest';

import dayjs, { Dayjs } from 'dayjs';

export class GoalsMockFactory {
  static repository = {
    getWeeklyGoalsWithCompletion: vi.fn(),
    getWeeklySummaryOfGoalsCompletedByDay: vi.fn(),
    getWeeklyFrequencyAndCompletionCount: vi.fn(),
    create: vi.fn(),
  };

  static service = {
    findWeeklyGoalsWithCompletion: vi.fn(),
    findWeeklySummaryOfGoalsCompletedByDay: vi.fn(),
    findWeeklyFrequencyAndCompletionCount: vi.fn(),
    create: vi.fn(),
  };

  static create = {
    id: (id = FakerFactory.data.uuid()): string => id,

    title: (): string => FakerFactory.goal.title(),

    desiredWeeklyFrequency: (max?: number): number =>
      FakerFactory.goal.desiredWeeklyFrequency(max),

    weekStartsAt: (): Dayjs => FakerFactory.goal.weekStartsAt(),

    goal: (override: Partial<Goal> = {}): Goal => ({
      id: GoalsMockFactory.create.id(),
      userId: UsersMockFactory.create.id(),
      title: GoalsMockFactory.create.title(),
      desiredWeeklyFrequency: GoalsMockFactory.create.desiredWeeklyFrequency(),
      createdAt: new Date('2025-08-30T00:00:00.000Z'),
      ...override,
    }),

    weeklyGoalsProgress: (
      override: Partial<Goal>[] = [],
    ): WeeklyGoalsProgress[] => {
      const [goal1 = {}, goal2 = {}] = override;

      return [
        {
          id: GoalsMockFactory.create.id(),
          title: GoalsMockFactory.create.title(),
          desiredWeeklyFrequency:
            GoalsMockFactory.create.desiredWeeklyFrequency(),
          completionCount: 7,
          ...goal1,
        },
        {
          id: GoalsMockFactory.create.id(),
          title: GoalsMockFactory.create.title(),
          desiredWeeklyFrequency:
            GoalsMockFactory.create.desiredWeeklyFrequency(3),
          completionCount: 3,
          ...goal2,
        },
      ];
    },

    weeklyGoalsSummary: (
      override: Partial<Goal>[] = [],
    ): WeeklyGoalsSummary => {
      const startOfWeek = dayjs(GoalsMockFactory.create.weekStartsAt()).startOf(
        'week',
      );

      const firstDayAnalysed = startOfWeek.format('YYYY-MM-DD');
      const secondDayAnalysed = startOfWeek.add(1, 'day').format('YYYY-MM-DD');

      const [goal1 = {}, goal2 = {}] = override;

      return {
        completed: 1,
        total: 7,
        goalsPerDay: {
          [firstDayAnalysed]: [
            {
              id: GoalsMockFactory.create.id(),
              title: GoalsMockFactory.create.title(),
              completedAt: new Date('2025-08-30T00:00:00.000Z'),
              ...goal1,
            },
          ],
          [secondDayAnalysed]: [
            {
              id: GoalsMockFactory.create.id(),
              title: GoalsMockFactory.create.title(),
              completedAt: new Date('2025-08-30T00:00:00.000Z'),
              ...goal2,
            },
          ],
        },
      };
    },

    goalProgressMetric: ({
      desiredWeeklyFrequency,
      countCompletion,
    }: GoalProgressMetric): GoalProgressMetric => ({
      desiredWeeklyFrequency,
      countCompletion,
    }),
  };

  static responses = {
    repository: {
      getWeeklyGoalsWithCompletion: {
        success: (override: Partial<Goal>[] = []) =>
          GoalsMockFactory.repository.getWeeklyGoalsWithCompletion.mockResolvedValue(
            GoalsMockFactory.create.weeklyGoalsProgress(override),
          ),
      },
      getWeeklySummaryOfGoalsCompletedByDay: {
        success: (override: Partial<Goal>[] = []) =>
          GoalsMockFactory.repository.getWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
            GoalsMockFactory.create.weeklyGoalsSummary(override),
          ),
      },
      getWeeklyFrequencyAndCompletionCount: {
        success: (override: Partial<GoalProgressMetric> = {}) =>
          GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount.mockResolvedValue(
            GoalsMockFactory.create.goalProgressMetric({
              desiredWeeklyFrequency: 7,
              countCompletion: 3,
              ...override,
            }),
          ),
        null: () =>
          GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount.mockResolvedValue(
            null,
          ),
        conflict: () =>
          GoalsMockFactory.repository.getWeeklyFrequencyAndCompletionCount.mockResolvedValue(
            GoalsMockFactory.create.goalProgressMetric({
              desiredWeeklyFrequency: 7,
              countCompletion: 7,
            }),
          ),
      },
      create: {
        success: (override: Partial<Goal> = {}) =>
          GoalsMockFactory.repository.create.mockResolvedValue(
            GoalsMockFactory.create.goal(override),
          ),
      },
    },

    service: {
      findWeeklyGoalsWithCompletion: {
        success: () => {
          GoalsMockFactory.responses.repository.getWeeklyGoalsWithCompletion.success();
          GoalsMockFactory.service.findWeeklyGoalsWithCompletion.mockResolvedValue(
            GoalsMockFactory.create.weeklyGoalsProgress(),
          );
        },
      },
      findWeeklySummaryOfGoalsCompletedByDay: {
        success: () => {
          GoalsMockFactory.responses.repository.getWeeklySummaryOfGoalsCompletedByDay.success();
          GoalsMockFactory.service.findWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
            GoalsMockFactory.create.weeklyGoalsSummary(),
          );
        },
      },
      create: {
        success: () => {
          GoalsMockFactory.responses.repository.create.success();
          GoalsMockFactory.service.create.mockResolvedValue(
            GoalsMockFactory.create.goal(),
          );
        },
      },
    },
  };
}
