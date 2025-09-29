import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class DeleteGoalsDTO {
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  goalsId: string[];
}
