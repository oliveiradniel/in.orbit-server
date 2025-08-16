import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGoalCompletedDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  goalId: string;
}
