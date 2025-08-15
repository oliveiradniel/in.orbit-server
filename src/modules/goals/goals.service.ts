import { Injectable } from '@nestjs/common';

import { GoalsRepository } from 'src/shared/database/repositories/goals.repositories';

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}

  async findWeekGoals() {}

  async create() {}
}
