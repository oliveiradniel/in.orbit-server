import { Inject, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { UsersService } from '../users/users.service';

import { GoalsRepository } from 'src/shared/contracts/goals.repository.contract';

import { CreateGoalDTO } from './dtos/create-goal.dto';
import { FindWeeklySummaryOfCompletedGoalsDTO } from './dtos/find-weekly-summary-of-completed-goals.dto';

import { GOALS_REPOSITORY, USERS_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class GoalsService {
  constructor(
    @Inject(GOALS_REPOSITORY) private readonly goalsRepository: GoalsRepository,
    @Inject(USERS_SERVICE) private readonly usersService: UsersService,
  ) {}

  async findWeeklyGoalsWithCompletion(userId: string) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    await this.usersService.findUserById(userId);

    return this.goalsRepository.getWeeklyGoalsWithCompletion({
      userId,
      lastDayOfWeek,
      firstDayOfWeek,
    });
  }

  async findWeeklySummaryOfGoalsCompletedByDay({
    userId,
    weekStartsAt,
  }: { userId: string } & FindWeeklySummaryOfCompletedGoalsDTO) {
    const firstDayOfWeek = weekStartsAt;
    const lastDayOfWeek = dayjs(weekStartsAt).endOf('week').toDate();

    await this.usersService.findUserById(userId);

    return this.goalsRepository.getWeeklySummaryOfGoalsCompletedByDay({
      userId,
      firstDayOfWeek,
      lastDayOfWeek,
    });
  }

  async create(userId: string, createGoalDTO: CreateGoalDTO) {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    await this.usersService.findUserById(userId);

    return this.goalsRepository.create(userId, {
      title,
      desiredWeeklyFrequency,
    });
  }
}
