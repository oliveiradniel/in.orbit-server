import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { type Prisma } from '@prisma/client';

import {
  type WeeklySummaryOfCompletedGoalsParams,
  type WeeklyFrequencyAndCompletionCountParams,
  type WeeklyGoalsWithCompletionResponse,
  WeeklySummaryOfCompletedGoalsResponse,
} from '../interfaces/Goal';

@Injectable()
export class GoalsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getWeeklySummaryOfGoalsCompletedByDay({
    firstDayOfWeek,
    lastDayOfWeek,
  }: WeeklySummaryOfCompletedGoalsParams) {
    const cteGoalsCreatedUpToWeek = `
      goals_created_up_to_week AS (
        SELECT id, title, desired_weekly_frequency AS "desiredWeeklyFrequency", created_at AS "createdAt"
        FROM goals
        WHERE created_at <= $1
      )
    `;

    const cteGoalsCompletedInWeek = `
      goals_completed_in_week AS (
        SELECT gc.id,
                g.title,
                gc.created_at AS "completedAt",
                DATE(gc.created_at) AS "completedAtDate"
        FROM goals_completed gc
        INNER JOIN goals g ON g.id = gc.goal_id
        WHERE gc.created_at BETWEEN $2 AND $1
      )
    `;

    const cteGoalsCompletedByWeekDay = `
      goals_completed_by_week_day AS (
        SELECT "completedAtDate",
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', gcw.id,
                    'title',  gcw.title,
                    'completedAt', gcw."completedAt"
                  )
                ) AS "completions"
        FROM goals_completed_in_week gcw
        GROUP BY "completedAtDate"
        ORDER BY "completedAtDate" DESC
      )
    `;

    const query = `
      WITH
        ${cteGoalsCreatedUpToWeek},
        ${cteGoalsCompletedInWeek},
        ${cteGoalsCompletedByWeekDay}
      SELECT
        (SELECT COUNT(*)::int FROM goals_completed_in_week) AS completed,
        (SELECT SUM(
                  gcuw."desiredWeeklyFrequency"
                )::int FROM goals_created_up_to_week gcuw
        ) AS total,
        (SELECT JSON_OBJECT_AGG(
                gcbd."completedAtDate",
                gcbd.completions
        ) FROM goals_completed_by_week_day gcbd) AS "goalsPerDay"
      ;
    `;

    return await this.prismaService.$queryRawUnsafe<
      WeeklySummaryOfCompletedGoalsResponse[]
    >(query, lastDayOfWeek, firstDayOfWeek);
  }

  async getWeeklyFrequencyAndCompletionCount({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: WeeklyFrequencyAndCompletionCountParams) {
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

  async getWeeklyGoalsWithCompletion({
    lastDayOfWeek,
    firstDayOfWeek,
  }: {
    firstDayOfWeek: Date;
    lastDayOfWeek: Date;
  }) {
    const cteGoalsCreatedUpToWeek = `
      goals_created_up_to_week AS (
        SELECT id, title, desired_weekly_frequency AS "desiredWeeklyFrequency", created_at AS "createdAt"
        FROM goals
        WHERE created_at <= $1
      )
    `;

    const cteCountOfCompletedGoals = `
      count_of_completed_goals AS (
        SELECT goal_id, COUNT(id)::int AS "completionCount"
        FROM goals_completed
        WHERE created_at BETWEEN $2 AND $1
        GROUP BY goal_id
      )
    `;

    const query = `
      WITH
        ${cteGoalsCreatedUpToWeek},
        ${cteCountOfCompletedGoals}
      SELECT g.id,
              g.title,
              g."desiredWeeklyFrequency",
              COALESCE(c."completionCount", 0) AS "completionCount"
      FROM goals_created_up_to_week g
      LEFT JOIN count_of_completed_goals c ON c.goal_id = g.id;
    `;

    return this.prismaService.$queryRawUnsafe<
      WeeklyGoalsWithCompletionResponse[]
    >(query, lastDayOfWeek, firstDayOfWeek);
  }

  create(createUserDTO: Prisma.GoalCreateInput) {
    const { title, desiredWeeklyFrequency } = createUserDTO;

    return this.prismaService.goal.create({
      data: {
        title,
        desiredWeeklyFrequency,
      },
    });
  }
}
