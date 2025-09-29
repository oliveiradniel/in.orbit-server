import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class DeleteGoalsDTO {
  @ApiProperty({
    type: 'array',
    example: [
      '2a763a03-7cb1-43c1-8d22-8cdf94220c10',
      'e273d906-dc4b-4609-9fb7-b41efe35a35e',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  goalsId: string[];
}
