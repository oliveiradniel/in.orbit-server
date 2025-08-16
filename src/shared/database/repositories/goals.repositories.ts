import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { type Prisma } from '@prisma/client';

import {
  type GetWeeklyFrequencyAndCompletionCountParams,
  type GetWeeklyGoalsWithCompletionResponse,
} from '../interfaces/Goal';

@Injectable()
export class GoalsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getWeeklyFrequencyAndCompletionCount({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: GetWeeklyFrequencyAndCompletionCountParams) {
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

    const ctePendingGoals = `
      WITH
        ${cteGoalsCreatedUpToWeek},
        ${cteCountOfCompletedGoals}
      SELECT g.id,
              g.title,
              g."desiredWeeklyFrequency",
              COALESCE(c."completionCount", 0) AS "completionCount"
      FROM goals_created_up_to_week g
      LEFT JOIN count_of_completed_goals c ON c.goal_id = g.id
    `;

    return this.prismaService.$queryRawUnsafe<
      GetWeeklyGoalsWithCompletionResponse[]
    >(ctePendingGoals, lastDayOfWeek, firstDayOfWeek);
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
