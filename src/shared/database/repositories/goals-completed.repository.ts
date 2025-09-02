import { Inject, Injectable } from '@nestjs/common';

import { GoalsCompletedRepository } from 'src/modules/goals-completed/contracts/goals-completed.repository.contract';

import { PrismaService } from '../prisma.service';

import { PRISMA_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class PrismaGoalsCompletedRepository
  implements GoalsCompletedRepository
{
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
  ) {}

  create({ goalId }: { goalId: string }) {
    return this.prismaService.goalCompleted.create({
      data: {
        goalId,
      },
    });
  }
}
