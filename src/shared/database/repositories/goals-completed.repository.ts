import { Injectable } from '@nestjs/common';

import { GoalsCompletedRepository } from 'src/modules/goals-completed/contracts/goals-completed.repository.contract';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaGoalsCompletedRepository
  implements GoalsCompletedRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  create({ goalId }: { goalId: string }) {
    return this.prismaService.goalCompleted.create({
      data: {
        goalId,
      },
    });
  }
}
