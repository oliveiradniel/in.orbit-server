import { GoalCompleted } from 'src/modules/goals-completed/entities/goal-completed.entity';
import { PrismaService } from 'src/shared/database/prisma.service';

export interface CreateTestGoalCompletedParams {
  prismaService: PrismaService;
  goalId: string;
  createdAt?: Date;
  otherGoalsCompleted?: Pick<GoalCompleted, 'goalId' | 'createdAt'>[];
}
