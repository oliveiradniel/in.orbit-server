import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import dayjs from 'dayjs';

import { GoalsService } from '../goals.service';

import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';

import { unitDescribeGoalNotExists } from './helpers/unit-describe-goal-not-exists.helper';
import { describeUserNotExistsInGoals } from 'src/shared/__tests__/helpers/unit/describe-user-not-exists-in-goals.helper';

import { type GoalsWithTotal } from 'src/shared/interfaces/goal/goal-without-user-id.interface';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goal/weekly-goals-progress.interface';

import { GOALS_REPOSITORY, USERS_SERVICE } from 'src/shared/constants/tokens';

describe('GoalsService', () => {
  let goalsService: GoalsService;

  let mockUserId: ReturnType<typeof UsersMockFactory.create.id>;

  beforeEach(async () => {
    mockUserId = UsersMockFactory.create.id();

    const module = await Test.createTestingModule({
      providers: [
        GoalsService,
        { provide: USERS_SERVICE, useValue: UsersMockFactory.service },
        { provide: GOALS_REPOSITORY, useValue: GoalsMockFactory.repository },
      ],
    }).compile();

    goalsService = module.get<GoalsService>(GoalsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findWeeklyGoalsWithCompletion', () => {
    it('should to return a goal with completion count', async () => {
      const mockGoals: Partial<WeeklyGoalsProgress>[] = [
        {
          id: GoalsMockFactory.create.id(),
          title: GoalsMockFactory.create.title(),
          desiredWeeklyFrequency: 3,
          completionCount: 3,
          status: 'completed',
        },
        {
          id: GoalsMockFactory.create.id(),
          title: GoalsMockFactory.create.title(),
          desiredWeeklyFrequency: 4,
          completionCount: 3,
          status: 'started',
        },
      ];

      const weeklyGoalsProgress =
        GoalsMockFactory.create.weeklyGoalsProgress(mockGoals);

      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getWeeklyGoalsWithCompletion.success(
        mockGoals,
      );

      const goal = await goalsService.findWeeklyGoalsWithCompletion(mockUserId);

      const firstDayOfWeek = dayjs().startOf('week').toDate();
      const lastDayOfWeek = dayjs().endOf('week').toDate();
      console.log({ weeklyGoalsProgress });
      console.log({ goal });
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

    describeUserNotExistsInGoals({
      request: () => goalsService.findWeeklyGoalsWithCompletion(mockUserId),
      classMethod: 'findWeeklyGoalsWithCompletion',
    });
  });

  describe('findWeeklySummaryOfGoalsCompletedByDay', () => {
    it('should to return a weekly summary of completed goals', async () => {
      const mockGoals = [
        {
          id: GoalsMockFactory.create.id(),
          title: GoalsMockFactory.create.title(),
        },
        {
          id: GoalsMockFactory.create.id(),
          title: GoalsMockFactory.create.title(),
        },
      ];

      const weeklyGoalsSummary =
        GoalsMockFactory.create.weeklyGoalsSummary(mockGoals);

      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getWeeklySummaryOfGoalsCompletedByDay.success(
        mockGoals,
      );

      const goal = await goalsService.findWeeklySummaryOfGoalsCompletedByDay({
        userId: mockUserId,
        weekStartsAt: GoalsMockFactory.create.weekStartsAt().toDate(),
      });

      const weekStartsAt = GoalsMockFactory.create.weekStartsAt();

      const firstDayOfWeek = weekStartsAt.toDate();
      const lastDayOfWeek = dayjs(weekStartsAt).endOf('week').toDate();

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(
        GoalsMockFactory.repository.getWeeklySummaryOfGoalsCompletedByDay,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          firstDayOfWeek,
          lastDayOfWeek,
        }),
      );
      expect(goal).toEqual(weeklyGoalsSummary);
    });

    describeUserNotExistsInGoals({
      request: () =>
        goalsService.findWeeklySummaryOfGoalsCompletedByDay({
          userId: mockUserId,
          weekStartsAt: GoalsMockFactory.create.weekStartsAt().toDate(),
        }),
      classMethod: 'findWeeklySummaryOfGoalsCompletedByDay',
    });
  });

  describe('findAllByUserId', () => {
    it('should to return all goals by active user when goals exists', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getAllByUserId.success();

      const listGoals: GoalsWithTotal =
        await goalsService.findAllByUserId(mockUserId);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.repository.getAllByUserId).toHaveBeenCalled();

      expect(listGoals.totalActiveGoals).toBe(3);
      expect(listGoals.goals).toHaveLength(3);

      listGoals.goals.forEach((goal) => {
        expect(typeof goal.id).toBe('string');
        expect(typeof goal.title).toBe('string');
        expect(typeof goal.desiredWeeklyFrequency).toBe('number');
        expect(goal.createdAt).toBeInstanceOf(Date);
      });
    });

    it('should to return empty goals by active user when not exists goals', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getAllByUserId.empty();

      const listGoals: GoalsWithTotal =
        await goalsService.findAllByUserId(mockUserId);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.repository.getAllByUserId).toHaveBeenCalled();

      expect(listGoals.totalActiveGoals).toBe(0);
      expect(listGoals.goals).toHaveLength(0);

      expect(listGoals.goals).toEqual([]);
    });

    describeUserNotExistsInGoals({
      request: () => goalsService.findAllByUserId(mockUserId),
      classMethod: 'findAllByUserId',
    });
  });

  describe('create', () => {
    let mockGoalTitle: ReturnType<typeof GoalsMockFactory.create.title>;
    let mockGoalFrequency: ReturnType<
      typeof GoalsMockFactory.create.desiredWeeklyFrequency
    >;

    beforeEach(() => {
      mockGoalTitle = GoalsMockFactory.create.title();
      mockGoalFrequency = GoalsMockFactory.create.desiredWeeklyFrequency();
    });

    it('should to create a goal and return it', async () => {
      const mockGoal = GoalsMockFactory.create.goal({
        title: mockGoalTitle,
        desiredWeeklyFrequency: mockGoalFrequency,
      });

      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.create.success(mockGoal);
      GoalsMockFactory.responses.repository.getGoalByTitle.notFound();

      const goal = await goalsService.create(mockUserId, {
        title: mockGoalTitle,
        desiredWeeklyFrequency: mockGoalFrequency,
      });

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(GoalsMockFactory.repository.create).toHaveBeenCalledWith(
        mockUserId,
        {
          title: mockGoalTitle,
          desiredWeeklyFrequency: mockGoalFrequency,
        },
      );

      expect(goal).toEqual(mockGoal);
    });

    it('should throw Conflict error when title already in use', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getGoalByTitle.found();

      await expect(
        goalsService.create(mockUserId, {
          title: mockGoalTitle,
          desiredWeeklyFrequency: mockGoalFrequency,
        }),
      ).rejects.toThrow(ConflictException);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(GoalsMockFactory.repository.create).not.toHaveBeenCalled();
      expect(GoalsMockFactory.service.create).not.toHaveBeenCalled();
    });

    describeUserNotExistsInGoals({
      request: () =>
        goalsService.create(mockUserId, {
          title: mockGoalTitle,
          desiredWeeklyFrequency: mockGoalFrequency,
        }),
      classMethod: 'create',
    });
  });

  describe('update', () => {
    let goal: ReturnType<typeof GoalsMockFactory.create.goal>;
    let newDesiredWeeklyFrequency: number;

    beforeAll(() => {
      newDesiredWeeklyFrequency = 7;
    });

    beforeEach(() => {
      goal = GoalsMockFactory.create.goal({
        desiredWeeklyFrequency: 5,
      });
    });

    it('should to update a goal and return it', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getGoalById.success();

      GoalsMockFactory.responses.repository.update.success({
        id: goal.id!,
        userId: mockUserId,
        desiredWeeklyFrequency: newDesiredWeeklyFrequency,
      });

      const updatedGoal = await goalsService.update(
        mockUserId,
        { goalId: goal.id! },
        { desiredWeeklyFrequency: newDesiredWeeklyFrequency },
      );

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.repository.getGoalById).toHaveBeenCalled();
      expect(GoalsMockFactory.repository.update).toHaveBeenCalled();

      expect(updatedGoal).toMatchObject({
        id: goal.id!,
        userId: mockUserId,
        desiredWeeklyFrequency: newDesiredWeeklyFrequency,
      });
    });

    unitDescribeGoalNotExists({
      request: () =>
        goalsService.update(
          mockUserId,
          { goalId: goal.id! },
          { desiredWeeklyFrequency: newDesiredWeeklyFrequency },
        ),
      classMethod: 'update',
      mockNotCalled: GoalsMockFactory.repository.update,
    });

    describeUserNotExistsInGoals({
      request: () =>
        goalsService.update(
          mockUserId,
          { goalId: GoalsMockFactory.create.id() },
          { desiredWeeklyFrequency: 7 },
        ),
      classMethod: 'update',
    });
  });

  describe('delete', () => {
    let goalId1: ReturnType<typeof GoalsMockFactory.create.id>;
    let goalId2: ReturnType<typeof GoalsMockFactory.create.id>;

    beforeEach(() => {
      const goal1 = GoalsMockFactory.create.goal();
      const goal2 = GoalsMockFactory.create.goal();

      goalId1 = goal1.id!;
      goalId2 = goal2.id!;
    });

    it('should to delete a goal with success', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getGoalById.success();
      GoalsMockFactory.responses.repository.deleteGoals.success();

      await goalsService.delete(mockUserId, {
        goalsId: [goalId1, goalId2],
      });

      expect(GoalsMockFactory.repository.deleteGoals).toHaveBeenCalledWith({
        userId: mockUserId,
        goalsId: [goalId1, goalId2],
      });
    });

    unitDescribeGoalNotExists({
      request: () =>
        goalsService.delete(mockUserId, { goalsId: [goalId1, goalId2] }),
      classMethod: 'delete',
      mockNotCalled: GoalsMockFactory.repository.deleteGoals,
    });

    describeUserNotExistsInGoals({
      request: () =>
        goalsService.delete(mockUserId, {
          goalsId: [goalId1, goalId2],
        }),
      classMethod: 'delete',
    });
  });
});
