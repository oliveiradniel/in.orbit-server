import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class GoalsCompletedRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({ goalId }: { goalId: string }) {
    return this.prismaService.goalCompleted.create({
      data: {
        goalId,
      },
    });
  }
}
