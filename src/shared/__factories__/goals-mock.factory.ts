import { Goal } from 'src/modules/goals/entities/goal.entity';

import { WeeklyGoalsProgress } from '../interfaces/goals/weekly-goals-progress.interface';
import { WeeklyGoalsSummary } from '../interfaces/goals/weekly-goals-summary.interface';

import { UsersMockFactory } from './users-mock.factory';

import { vi } from 'vitest';

import dayjs from 'dayjs';

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
    create: vi.fn(),
  };

  static create = {
    id: (id = 'goal-id') => id,

    goal: (override?: Partial<Goal>): Goal => ({
      id: this.create.id(),
      userId: UsersMockFactory.create.id(),
      title: 'Acordar cedo',
      desiredWeeklyFrequency: 7,
      createdAt: new Date('2025-08-30T00:00:00.000Z'),
      ...override,
    }),

    weeklyGoalsProgress: (): WeeklyGoalsProgress[] => [
      {
        id: this.create.id(),
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 4,
        completionCount: 3,
      },
      {
        id: this.create.id('goal-id-2'),
        title: 'Estudar',
        desiredWeeklyFrequency: 7,
        completionCount: 3,
      },
    ],

    weeklyGoalsSummary: (): WeeklyGoalsSummary => {
      const startOfWeek = dayjs().startOf('week');

      const firstDayAnalysed = startOfWeek.format('YYYY-MM-DD');
      const secondDayAnalysed = startOfWeek.add(1, 'day').format('YYYY-MM-DD');

      return {
        completed: 1,
        total: 7,
        goalsPerDay: {
          [firstDayAnalysed]: [
            {
              id: 'mock-goal',
              title: 'Acordar cedo',
              completedAt: new Date('2025-08-30T00:00:00.000Z'),
            },
          ],
          [secondDayAnalysed]: [
            {
              id: 'mock-goal',
              title: 'Acordar cedo',
              completedAt: new Date('2025-08-30T00:00:00.000Z'),
            },
          ],
        },
      };
    },
  };

  static responses = {
    repository: {
      getWeeklyGoalsWithCompletion: {
        success: () =>
          this.repository.getWeeklyGoalsWithCompletion.mockResolvedValue(
            this.create.weeklyGoalsProgress(),
          ),
      },
      getWeeklySummaryOfGoalsCompletedByDay: {
        success: () =>
          this.repository.getWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
            this.create.weeklyGoalsSummary(),
          ),
      },
      create: {
        success: () =>
          this.repository.create.mockResolvedValue(this.create.goal()),
      },
    },

    service: {
      findWeeklyGoalsWithCompletion: {
        success: () => {
          const data = this.create.weeklyGoalsProgress();
          this.repository.getWeeklyGoalsWithCompletion.mockResolvedValue(data);
          this.service.findWeeklyGoalsWithCompletion.mockResolvedValue(data);
        },
      },
      findWeeklySummaryOfGoalsCompletedByDay: {
        success: () => {
          const data = this.create.weeklyGoalsSummary();
          this.repository.getWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
            data,
          );
          this.service.findWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
            data,
          );
        },
      },
      create: {
        success: () => {
          const data = this.create.goal();
          this.repository.create.mockResolvedValue(data);
          this.service.create.mockResolvedValue(data);
        },
      },
    },
  };
}
