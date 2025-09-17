import { GoalCompleted } from 'src/modules/goals-completed/entities/goal-completed.entity';
import { PrismaService } from 'src/shared/database/prisma.service';

type OtherGoalCompleted = Pick<GoalCompleted, 'goalId'> &
  Partial<Pick<GoalCompleted, 'createdAt'>>;

export interface CreateTestGoalCompletedParams {
  prismaService: PrismaService;
  goalId: string;
  createdAt?: Date;
  otherGoalsCompleted?: OtherGoalCompleted[];
}
