import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import dayjs from 'dayjs';

import {
  GOALS_COMPLETED_REPOSITORY,
  GoalsCompletedRepository,
} from './contracts/goals-completed.repository.contract';

import {
  GOALS_REPOSITORY,
  GoalsRepository,
} from 'src/shared/contracts/goals.repository.contract';

import { CreateGoalCompletedDTO } from './dtos/create-goal-completed.dto';

@Injectable()
export class GoalsCompletedService {
  constructor(
    @Inject(GOALS_COMPLETED_REPOSITORY)
    private readonly goalsCompletedRepository: GoalsCompletedRepository,
    @Inject(GOALS_REPOSITORY) private readonly goalsRepository: GoalsRepository,
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
