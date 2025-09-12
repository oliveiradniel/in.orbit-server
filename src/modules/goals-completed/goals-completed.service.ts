import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import dayjs from 'dayjs';

import { GoalsCompletedRepository } from './contracts/goals-completed.repository.contract';
import { GoalsRepository } from 'src/shared/contracts/goals.repository.contract';

import { CreateGoalCompletedDTO } from './dtos/create-goal-completed.dto';

import { type GoalCompleted } from './entities/goal-completed.entity';

import {
  GOALS_COMPLETED_REPOSITORY,
  GOALS_REPOSITORY,
} from 'src/shared/constants/tokens';

@Injectable()
export class GoalsCompletedService {
  constructor(
    @Inject(GOALS_COMPLETED_REPOSITORY)
    private readonly goalsCompletedRepository: GoalsCompletedRepository,
    @Inject(GOALS_REPOSITORY) private readonly goalsRepository: GoalsRepository,
  ) {}

  async create({ goalId }: CreateGoalCompletedDTO): Promise<GoalCompleted> {
    const today = new Date();

    const hasThisGoalCompletedToday =
      await this.goalsCompletedRepository.getGoalCompletedByDateAndByGoalId({
        goalId,
        date: today,
      });

    if (hasThisGoalCompletedToday) {
      throw new BadRequestException(
        'This goal has already been completed today.',
      );
    }

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
