import { PrismaService } from 'src/shared/database/prisma.service';

export interface CreateTestGoalCompletedParams {
  prismaService: PrismaService;
  goalId: string;
  otherGoalsCompleted?: string[];
}
