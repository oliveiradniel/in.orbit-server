import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import dayjs from 'dayjs';

import { GoalsCompletedRepository } from 'src/shared/database/repositories/goals-completed.repository';
import { GoalsRepository } from 'src/shared/database/repositories/goals.repository';

import { CreateGoalCompletedDTO } from './dtos/create-goal-completed.dto';

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

    if (!goal) {
      throw new NotFoundException('Goal not exists!');
    }

    if (goal.countCompletion >= goal.desiredWeeklyFrequency) {
      throw new ConflictException('Goal already completed this week');
    }

    return this.goalsCompletedRepository.create({ goalId });
  }
}
