import { IsNotEmpty, IsUUID } from 'class-validator';

export class GoalIdParam {
  @IsUUID()
  @IsNotEmpty()
  goalId: string;
}
