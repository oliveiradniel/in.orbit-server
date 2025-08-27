import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { GoalsRepository } from 'src/shared/contracts/goals.repository.contract';

import { CreateGoalDTO } from './dtos/create-goal.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoalsService {
  constructor(
    private readonly goalsRepository: GoalsRepository,
    private readonly usersService: UsersService,
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

  async findWeeklySummaryOfGoalsCompletedByDay(userId: string) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

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
