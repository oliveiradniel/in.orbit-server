import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class GoalsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getWeekGoals() {}

  async create() {}
}
