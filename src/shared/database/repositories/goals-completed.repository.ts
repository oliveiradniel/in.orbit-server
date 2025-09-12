import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { type GoalCompleted } from '@prisma/client';
import { type GoalsCompletedRepository } from 'src/modules/goals-completed/contracts/goals-completed.repository.contract';
import { type GoalCompletedDateFilter } from '../interfaces/goal-completed/goal-completed-date-filter.interface';
import { type CreateGoalCompleted } from '../interfaces/goal-completed/create-goal-completed.interface';

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

  async create({
    userId,
    goalId,
    experiencePoints,
  }: CreateGoalCompleted): Promise<GoalCompleted> {
    const updateUserExperiencePoints = this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        experiencePoints: {
          increment: experiencePoints,
        },
      },
    });

    const createGoalCompleted = this.prismaService.goalCompleted.create({
      data: {
        goalId,
      },
    });

    const [goalCompleted] = await this.prismaService.$transaction([
      createGoalCompleted,
      updateUserExperiencePoints,
    ]);

    return goalCompleted;
  }
}
