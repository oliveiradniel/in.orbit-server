import { Goal } from 'src/modules/goals/entities/goal.entity';

import { FakerFactory } from 'src/shared/__factories__/faker.factory';

import { CreateTestGoalParams } from 'src/shared/interfaces/helpers/create-test-goal.interface';

export async function createTestGoal(
  params: Omit<CreateTestGoalParams, 'otherGoals'>,
): Promise<Goal>;

export async function createTestGoal(
  params: CreateTestGoalParams,
): Promise<Goal[]>;

export async function createTestGoal({
  prismaService,
  userId,
  override,
  otherGoals,
}: CreateTestGoalParams): Promise<Goal | Goal[]> {
  const goal = await prismaService.goal.create({
    data: {
      userId,
      title: FakerFactory.goal.title(),
      desiredWeeklyFrequency: FakerFactory.goal.desiredWeeklyFrequency(),
      ...override,
    },
  });

  if (otherGoals && otherGoals.length > 0) {
    const goalsToCreate = otherGoals.map(({ title, desiredWeeklyFrequency }) =>
      prismaService.goal.create({
        data: {
          userId,
          title,
          desiredWeeklyFrequency,
        },
      }),
    );

    const goals = await prismaService.$transaction([...goalsToCreate]);

    return [goal, ...goals];
  }

  return goal;
}
