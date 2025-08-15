import { Injectable } from '@nestjs/common';

import { GoalsRepository } from 'src/shared/database/repositories/goals.repositories';

import { CreateGoalDTO } from './dto/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}

  async findWeekGoals() {}

  create(createGoalDTO: CreateGoalDTO) {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.goalsRepository.create({ title, desiredWeeklyFrequency });
  }
}
