import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { GoalsRepository } from 'src/shared/database/repositories/goals.repositories';

import { CreateGoalDTO } from './dto/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}

  async findWeeklyGoalsWithCompletion() {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    return this.goalsRepository.getWeeklyGoalsWithCompletion({
      lastDayOfWeek,
      firstDayOfWeek,
    });
  }

  create(createGoalDTO: CreateGoalDTO) {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    return this.goalsRepository.create({ title, desiredWeeklyFrequency });
  }
}
