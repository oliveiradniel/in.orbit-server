import { Goal } from 'src/modules/goals/entities/goal.entity';

import { PrismaService } from 'src/shared/database/prisma.service';

export interface CreateTestGoalParams {
  prismaService: PrismaService;
  userId: string;
  override?: Omit<Partial<Goal>, 'userId'>;
  otherGoals?: Pick<Goal, 'title' | 'desiredWeeklyFrequency'>[];
}
