import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findWeekGoals() {}

  async create() {}
}
