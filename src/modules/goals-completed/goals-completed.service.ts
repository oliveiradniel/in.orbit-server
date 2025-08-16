import { Injectable } from '@nestjs/common';

import { GoalsCompletedRepository } from 'src/shared/database/repositories/goals-completed.repositories';

import { CreateGoalCompletedDTO } from './dto/create-goal-completed.dto';

@Injectable()
export class GoalsCompletedService {
  constructor(
    private readonly goalsCompletedRepository: GoalsCompletedRepository,
  ) {}

  async create({ goalId }: CreateGoalCompletedDTO) {
    return this.goalsCompletedRepository.create({ goalId });
  }
}
