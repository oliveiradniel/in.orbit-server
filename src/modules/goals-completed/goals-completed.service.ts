import { ConflictException, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { GoalsCompletedRepository } from 'src/shared/database/repositories/goals-completed.repositories';
import { GoalsRepository } from 'src/shared/database/repositories/goals.repositories';

import { CreateGoalCompletedDTO } from './dto/create-goal-completed.dto';

@Injectable()
export class GoalsCompletedService {
  constructor(
    private readonly goalsCompletedRepository: GoalsCompletedRepository,
    private readonly goalsRepository: GoalsRepository,
  ) {}

  async create({ goalId }: CreateGoalCompletedDTO) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    const goal =
      await this.goalsRepository.getWeeklyFrequencyAndCompletionCount({
        goalId,
        firstDayOfWeek,
        lastDayOfWeek,
      });

    if (!goal) return null;

    if (goal.countCompletion >= goal.desiredWeeklyFrequency) {
      throw new ConflictException('Goal already completed this week');
    }

    return this.goalsCompletedRepository.create({ goalId });
  }
}
