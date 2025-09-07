import { GoalCompleted } from 'src/modules/goals-completed/entities/goal-completed.entity';

import { CreateTestGoalCompletedParams } from 'src/shared/interfaces/helpers/create-test-goal-completed.interface';

export async function createTestGoalCompleted(
  params: Omit<CreateTestGoalCompletedParams, 'otherGoals'>,
): Promise<GoalCompleted>;

export async function createTestGoalCompleted(
  params: CreateTestGoalCompletedParams,
): Promise<GoalCompleted[]>;

export async function createTestGoalCompleted({
  prismaService,
  goalId,
  otherGoalsCompleted = [],
}: CreateTestGoalCompletedParams): Promise<GoalCompleted | GoalCompleted[]> {
  const goalCompleted = await prismaService.goalCompleted.create({
    data: {
      goalId,
    },
  });

  if (otherGoalsCompleted && otherGoalsCompleted.length > 0) {
    const goalsToCreate = otherGoalsCompleted.map((currentGoalId) =>
      prismaService.goalCompleted.create({
        data: {
          goalId: currentGoalId,
        },
      }),
    );

    const goalsCompleted = await prismaService.$transaction([...goalsToCreate]);

    return [goalCompleted, ...goalsCompleted];
  }

  return goalCompleted;
}
