import { CreateGoalCompletedDTO } from '../dtos/create-goal-completed.dto';

export type CreateGoalCompletedInput = CreateGoalCompletedDTO & {
  userId: string;
};
