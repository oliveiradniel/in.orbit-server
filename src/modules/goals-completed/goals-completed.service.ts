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

import { type GoalCompleted } from './entities/goal-completed.entity';
import { type CreateGoalCompletedInput } from './interfaces/create-goal-completed-input.interface';

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

  async create({
    userId,
    goalId,
  }: CreateGoalCompletedInput): Promise<GoalCompleted> {
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
      throw new NotFoundException('Goal not exists.');
    }

    const { countCompletion, desiredWeeklyFrequency } = goal;

    if (countCompletion >= desiredWeeklyFrequency) {
      throw new ConflictException('Goal already completed this week.');
    }

    const isLastCompletionFromGoal =
      countCompletion + 1 === desiredWeeklyFrequency;
    const earnedExperiencePoints = isLastCompletionFromGoal ? 7 : 5;

    return this.goalsCompletedRepository.create({
      userId,
      goalId,
      experiencePoints: earnedExperiencePoints,
    });
  }
}
