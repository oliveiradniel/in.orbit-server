import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { type Goal, type Prisma } from '@prisma/client';
import { type GoalsRepository } from 'src/shared/contracts/goals.repository.contract';

import {
  type GoalDateRangeFilter,
  type UserDateRangeFilter,
} from '../interfaces/goal/range-filters.interfaces';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from 'src/shared/interfaces/goal/weekly-goals-summary.interface';
import { type GoalProgressMetric } from 'src/shared/interfaces/goal/goal-progress-metric.interface';
import { type GoalsWithTotal } from 'src/shared/interfaces/goal/goal-without-user-id.interface';
import { type DataToUpdateGoal } from '../interfaces/goal/data-to-update-goal.interface';
import { type DataToDeleteGoals } from '../interfaces/goal/data-to-delete-goals.interface';

import { PRISMA_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class PrismaGoalsRepository implements GoalsRepository {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
  ) {}

  getGoalById(goalId: string): Promise<Goal | null> {
    return this.prismaService.goal.findFirst({
      where: { id: goalId, isDeleted: false },
    });
  }

  getGoalByTitle(userId: string, title: string): Promise<Goal | null> {
    return this.prismaService.goal.findFirst({
      where: {
        userId,
        title: {
          equals: title,
          mode: 'insensitive',
        },
        isDeleted: false,
      },
    });
  }

  async getWeeklyGoalsWithCompletion({
    userId,
    lastDayOfWeek,
    firstDayOfWeek,
  }: UserDateRangeFilter): Promise<WeeklyGoalsProgress[]> {
    const cteGoalsCreatedUpToWeek = `
      goals_created_up_to_week AS (
        SELECT id, title, desired_weekly_frequency AS "desiredWeeklyFrequency", created_at AS "createdAt"
        FROM goals
        WHERE created_at <= $1 AND user_id = $3::uuid AND is_deleted = false
      )
    `;

    const cteCountOfCompletedGoals = `
      count_of_completed_goals AS (
        SELECT goal_id, COUNT(gc.id)::int AS "completionCount"
        FROM goals_completed gc
        INNER JOIN goals g ON g.id = gc.goal_id
        WHERE gc.created_at BETWEEN $2 AND $1
          AND g.user_id = $3::uuid
        GROUP BY gc.goal_id
      )
    `;

    const cteIsGoalCompletedToday = `
      is_goal_completed_today AS (
        SELECT DISTINCT gc.goal_id, true AS "wasCompletedToday"
        FROM goals_completed gc
        INNER JOIN goals g ON g.id = gc.goal_id
        WHERE DATE(gc.created_at) = CURRENT_DATE
        AND g.user_id = $3::uuid
      )
    `;

    const query = `
      WITH
        ${cteGoalsCreatedUpToWeek},
        ${cteCountOfCompletedGoals},
        ${cteIsGoalCompletedToday}
      SELECT g.id,
              g.title,
              g."desiredWeeklyFrequency",
              COALESCE(c."completionCount", 0) AS "completionCount",
              COALESCE(t."wasCompletedToday", false) AS "wasCompletedToday"
      FROM goals_created_up_to_week g
      LEFT JOIN count_of_completed_goals c ON c.goal_id = g.id
      LEFT JOIN is_goal_completed_today t ON t.goal_id = g.id;
    `;

    return this.prismaService.$queryRawUnsafe<WeeklyGoalsProgress[]>(
      query,
      lastDayOfWeek,
      firstDayOfWeek,
      userId,
    );
  }

  async getWeeklySummaryOfGoalsCompletedByDay({
    userId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: UserDateRangeFilter): Promise<WeeklyGoalsSummary> {
    const cteGoalsCreatedUpToWeek = `
      goals_created_up_to_week AS (
        SELECT id,
               title,
               desired_weekly_frequency AS "desiredWeeklyFrequency",
               created_at AS "createdAt",
               is_deleted AS "isDeleted"
        FROM goals
        WHERE created_at <= $1
          AND user_id = $3::uuid
      )
    `;

    const cteGoalsCompletedInWeek = `
      goals_completed_in_week AS (
        SELECT gc.id,
               gc.goal_id AS "goalId",
               g.title,
               g.is_deleted AS "isDeleted",
               gc.created_at AS "completedAt",
               DATE(gc.created_at) AS "completedAtDate"
        FROM goals_completed gc
        LEFT JOIN goals g ON g.id = gc.goal_id
        WHERE gc.created_at BETWEEN $2 AND $1 AND g.user_id = $3::uuid
        ORDER BY gc.created_at DESC
      )
    `;

    const cteGoalsCompletedByWeekDay = `
      goals_completed_by_week_day AS (
        SELECT "completedAtDate",
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', gcw.id,
                    'title', gcw.title,
                    'isDeleted', gcw."isDeleted",
                    'completedAt', gcw."completedAt"
                  )
                ) AS "completions"
        FROM goals_completed_in_week gcw
        GROUP BY "completedAtDate"
        ORDER BY "completedAtDate" DESC
      )
    `;

    const cteRelevantGoals = `
      relevant_goals AS (
        SELECT gcuw.id AS "goalId",
               gcuw."desiredWeeklyFrequency",
               gcuw."isDeleted",
               COALESCE(gcw."completedCount", 0) AS "completedCount"
        FROM goals_created_up_to_week gcuw
        LEFT JOIN (
          SELECT
            "goalId",
            COUNT(*) AS "completedCount"
          FROM goals_completed_in_week
          GROUP BY "goalId"
        ) gcw ON gcw."goalId" = gcuw.id
      )
    `;

    const query = `
      WITH
        ${cteGoalsCreatedUpToWeek},
        ${cteGoalsCompletedInWeek},
        ${cteRelevantGoals},
        ${cteGoalsCompletedByWeekDay}
      SELECT
        (SELECT COUNT(*)::int FROM goals_completed_in_week) AS completed,

        (SELECT COALESCE(SUM(
          CASE
            WHEN rg."isDeleted" = false THEN rg."desiredWeeklyFrequency"
            ELSE rg."completedCount"
          END
        )::int, 0)
          FROM relevant_goals rg
        ) AS total,

        (SELECT JSON_OBJECT_AGG(
                gcbd."completedAtDate",
                gcbd.completions
        ) FROM goals_completed_by_week_day gcbd) AS "goalsPerDay"
      ;
    `;

    const row = await this.prismaService.$queryRawUnsafe<WeeklyGoalsSummary[]>(
      query,
      lastDayOfWeek,
      firstDayOfWeek,
      userId,
    );

    return row[0];
  }

  async getWeeklyFrequencyAndCompletionCount({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalDateRangeFilter): Promise<GoalProgressMetric | null> {
    const goal = await this.prismaService.goal.findUnique({
      where: { id: goalId },
      select: {
        desiredWeeklyFrequency: true,
        goalCompleted: {
          where: {
            createdAt: {
              gte: firstDayOfWeek,
              lte: lastDayOfWeek,
            },
          },
          select: { id: true },
        },
      },
    });

    if (!goal) return null;

    return {
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      countCompletion: goal.goalCompleted.length,
    };
  }

  async getAllByUserId(userId: string): Promise<GoalsWithTotal> {
    const [goals, totalActiveGoals] = await Promise.all([
      this.prismaService.goal.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          title: true,
          desiredWeeklyFrequency: true,
          createdAt: true,
          isDeleted: true,
        },
      }),
      this.prismaService.goal.count({
        where: { userId, isDeleted: false },
      }),
    ]);

    return { goals, totalActiveGoals };
  }

  create(
    userId: string,
    createGoalDTO: Prisma.GoalUncheckedCreateInput,
  ): Promise<Goal> {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.prismaService.goal.create({
      data: {
        userId,
        title,
        desiredWeeklyFrequency,
      },
    });
  }

  async update(dataToUpdateGoal: DataToUpdateGoal): Promise<Goal | null> {
    const { userId, goalId, desiredWeeklyFrequency } = dataToUpdateGoal;

    const goal = await this.prismaService.goal.findFirst({
      where: { id: goalId, userId, isDeleted: false },
    });

    if (!goal) return null;

    return this.prismaService.goal.update({
      where: { id: goalId },
      data: { desiredWeeklyFrequency },
    });
  }

  async deleteGoals({ userId, goalsId }: DataToDeleteGoals): Promise<void> {
    const goalsToBeDeleted = goalsId.map((goalId) =>
      this.prismaService.goal.updateMany({
        where: { userId, id: goalId, isDeleted: false },
        data: { isDeleted: true },
      }),
    );

    await Promise.all(goalsToBeDeleted);
  }
}
