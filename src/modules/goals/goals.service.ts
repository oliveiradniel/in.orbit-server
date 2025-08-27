import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { GoalsRepository } from 'src/shared/database/repositories/goals.repository';

import { CreateGoalDTO } from './dtos/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}

  async findWeeklyGoalsWithCompletion(userId: string) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    return this.goalsRepository.getWeeklyGoalsWithCompletion({
      userId,
      lastDayOfWeek,
      firstDayOfWeek,
    });
  }

  findWeeklySummaryOfGoalsCompletedByDay(userId: string) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    return this.goalsRepository.getWeeklySummaryOfGoalsCompletedByDay({
      userId,
      firstDayOfWeek,
      lastDayOfWeek,
    });
  }

  create(userId: string, createGoalDTO: CreateGoalDTO) {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.goalsRepository.create({
      userId,
      title,
      desiredWeeklyFrequency,
    });
  }
}
