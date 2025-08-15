import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class GoalsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getWeekGoals() {}

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
