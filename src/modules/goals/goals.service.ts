import { Inject, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { UsersService } from '../users/users.service';

import { CreateGoalDTO } from './dtos/create-goal.dto';
import { FindWeeklySummaryOfCompletedGoalsDTO } from './dtos/find-weekly-summary-of-completed-goals.dto';

import { type Goal } from './entities/goal.entity';
import { type GoalsRepository } from 'src/shared/contracts/goals.repository.contract';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from 'src/shared/interfaces/goal/weekly-goals-summary.interface';

import { GOALS_REPOSITORY, USERS_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class GoalsService {
  constructor(
    @Inject(GOALS_REPOSITORY) private readonly goalsRepository: GoalsRepository,
    @Inject(USERS_SERVICE) private readonly usersService: UsersService,
  ) {}

  async findWeeklyGoalsWithCompletion(
    userId: string,
  ): Promise<WeeklyGoalsProgress[]> {
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
  }: {
    userId: string;
  } & FindWeeklySummaryOfCompletedGoalsDTO): Promise<WeeklyGoalsSummary> {
    const firstDayOfWeek = dayjs(weekStartsAt).startOf('week').toDate();
    const lastDayOfWeek = dayjs(weekStartsAt).endOf('week').toDate();

    await this.usersService.findUserById(userId);

    return this.goalsRepository.getWeeklySummaryOfGoalsCompletedByDay({
      userId,
      firstDayOfWeek,
      lastDayOfWeek,
    });
  }

  async create(userId: string, createGoalDTO: CreateGoalDTO): Promise<Goal> {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    await this.usersService.findUserById(userId);

    return this.goalsRepository.create(userId, {
      title,
      desiredWeeklyFrequency,
    });
  }
}
