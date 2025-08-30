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
    id: (id = 'goal-id') => {
      return id;
    },

    goal: (override?: Partial<Goal>): Goal => ({
      id: this.create.id(),
      userId: UsersMockFactory.createUserId(),
      title: 'Acordar cedo',
      desiredWeeklyFrequency: 7,
      createdAt: new Date(),
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
      const secondDayAnalysed = startOfWeek.add(1, 'day');

      return {
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
    },
  };

  static responses = {
    repository: {
      getWeeklyGoalsWithCompletionSuccess: () =>
        this.repository.getWeeklyGoalsWithCompletion.mockResolvedValue(
          this.create.weeklyGoalsProgress(),
        ),
      getWeeklySummaryOfGoalsCompletedByDaySuccess: () =>
        this.repository.getWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
          this.create.weeklyGoalsSummary(),
        ),
      createGoalSuccess: () =>
        this.repository.create.mockResolvedValue(this.create.goal()),
    },

    service: {
      findWeeklyGoalsWithCompletionSuccess: () => {
        const data = this.create.weeklyGoalsProgress();
        this.repository.getWeeklyGoalsWithCompletion.mockResolvedValue(data);
        this.service.findWeeklyGoalsWithCompletion.mockResolvedValue(data);
      },
      findWeeklySummaryOfGoalsCompletedByDaySuccess: () => {
        const data = this.create.weeklyGoalsSummary();
        this.repository.getWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
          data,
        );
        this.service.findWeeklySummaryOfGoalsCompletedByDay.mockResolvedValue(
          data,
        );
      },
      createGoalSuccess: () => {
        const data = this.create.goal();
        this.repository.create.mockResolvedValue(data);
        this.service.create.mockResolvedValue(data);
      },
    },
  };
}
