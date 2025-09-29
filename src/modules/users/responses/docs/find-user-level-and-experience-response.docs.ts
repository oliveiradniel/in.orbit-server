import { ApiProperty } from '@nestjs/swagger';

export class FindUserLevelAndExperienceResponseDOCS {
  @ApiProperty({
    type: 'number',
    example: '2',
    description: 'User level.',
  })
  level: string;

  @ApiProperty({
    type: 'number',
    example: 31,
    description: 'User experience points.',
  })
  experiencePoints: string;

  @ApiProperty({
    type: 'number',
    example: 59,
    description:
      'Total experience that the user needs to reach the next level.',
  })
  experienceToNextLevel: string;
}
