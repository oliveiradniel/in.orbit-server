import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { type GoalCompleted } from '@prisma/client';
import { type GoalsCompletedRepository } from 'src/modules/goals-completed/contracts/goals-completed.repository.contract';
import { type GoalCompletedDateFilter } from '../interfaces/goal-completed/goal-completed-date-filter.interface';

import { PRISMA_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class PrismaGoalsCompletedRepository
  implements GoalsCompletedRepository
{
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
  ) {}

  async getGoalCompletedByDateAndByGoalId({
    goalId,
    date,
  }: GoalCompletedDateFilter): Promise<GoalCompleted | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prismaService.goalCompleted.findFirst({
      where: {
        goalId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  create({ goalId }: { goalId: string }): Promise<GoalCompleted> {
    return this.prismaService.goalCompleted.create({
      data: {
        goalId,
      },
    });
  }
}
