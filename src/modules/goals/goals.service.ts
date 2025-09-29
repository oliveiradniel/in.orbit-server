import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import dayjs from 'dayjs';

import { UsersService } from '../users/users.service';

import { CreateGoalDTO } from './dtos/create-goal.dto';
import { UpdateGoalDTO } from './dtos/update-goal.dto';
import { DeleteGoalsDTO } from './dtos/delete-goals.dto';

import { WeekStartsAtQuery } from './queries/week-starts-at.query';

import { GoalIdParam } from './params/goal-id.param';

import { type Goal } from './entities/goal.entity';
import { type GoalsRepository } from 'src/shared/contracts/goals.repository.contract';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from 'src/shared/interfaces/goal/weekly-goals-summary.interface';
import { type GoalsWithTotal } from 'src/shared/interfaces/goal/goal-without-user-id.interface';

import { GOALS_REPOSITORY, USERS_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class GoalsService {
  constructor(
    @Inject(GOALS_REPOSITORY) private readonly goalsRepository: GoalsRepository,
    @Inject(USERS_SERVICE) private readonly usersService: UsersService,
  ) {}

  async findGoalById(goalId: string): Promise<Goal> {
    const goal = await this.goalsRepository.getGoalById(goalId);

    if (!goal) {
      throw new NotFoundException('Goal not found.');
    }

    return goal;
  }

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
  } & WeekStartsAtQuery): Promise<WeeklyGoalsSummary> {
    const firstDayOfWeek = dayjs(weekStartsAt).startOf('week').toDate();
    const lastDayOfWeek = dayjs(weekStartsAt).endOf('week').toDate();

    await this.usersService.findUserById(userId);

    return this.goalsRepository.getWeeklySummaryOfGoalsCompletedByDay({
      userId,
      firstDayOfWeek,
      lastDayOfWeek,
    });
  }

  async findAllByUserId(userId: string): Promise<GoalsWithTotal> {
    await this.usersService.findUserById(userId);

    return this.goalsRepository.getAllByUserId(userId);
  }

  async create(userId: string, createGoalDTO: CreateGoalDTO): Promise<Goal> {
    const { title, desiredWeeklyFrequency } = createGoalDTO;

    await this.usersService.findUserById(userId);

    const titleAlreadyInUse = await this.goalsRepository.getGoalByTitle(
      userId,
      title,
    );
    if (titleAlreadyInUse) {
      throw new ConflictException('This title already in use.');
    }

    return this.goalsRepository.create(userId, {
      title,
      desiredWeeklyFrequency,
    });
  }

  async update(
    userId: string,
    updateGoalParam: GoalIdParam,
    updateGoalDTO: UpdateGoalDTO,
  ): Promise<Goal> {
    const { goalId } = updateGoalParam;
    const { desiredWeeklyFrequency } = updateGoalDTO;

    await this.usersService.findUserById(userId);
    await this.findGoalById(goalId);

    return this.goalsRepository.update({
      userId,
      goalId,
      desiredWeeklyFrequency,
    });
  }

  async delete(userId: string, deleteGoalDTO: DeleteGoalsDTO) {
    const { goalsId } = deleteGoalDTO;

    await this.usersService.findUserById(userId);

    const goalsToBeValidated = goalsId.map((goalId) =>
      this.findGoalById(goalId),
    );

    await Promise.all(goalsToBeValidated);

    return this.goalsRepository.deleteGoals({ userId, goalsId });
  }
}
