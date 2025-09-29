import { Controller, Get, Inject } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';

import { FindUserByIdResponseDOCS } from './responses/docs/find-user-by-id-response.docs';
import { FindUserLevelAndExperienceResponseDOCS } from './responses/docs/find-user-level-and-experience-response.docs';

import { UnauthorizedResponseDOCS } from 'src/shared/responses/docs/unauthorized-response.docs';
import { NotFoundUserResponseDOCS } from 'src/shared/responses/docs/not-found-user-response.docs';

import { type UserWithoutExternalAccountId } from 'src/shared/database/interfaces/user/user-without-external-account-id.interface';
import { type GamificationInfo } from './interfaces/gamification-info.interface';

import { USERS_SERVICE } from 'src/shared/constants/tokens';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDOCS,
})
@ApiNotFoundResponse({
  description: 'User not found.',
  type: NotFoundUserResponseDOCS,
})
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: UsersService,
  ) {}

  @ApiOkResponse({
    description: 'Returns the currently authenticated user.',
    type: FindUserByIdResponseDOCS,
  })
  @Get()
  findUserById(
    @ActiveUserId() userId: string,
  ): Promise<UserWithoutExternalAccountId> {
    return this.usersService.findUserById(userId);
  }

  @ApiOkResponse({
    description:
      'Returns the level, experience points and total points needed to reach the next level.',
    type: FindUserLevelAndExperienceResponseDOCS,
  })
  @Get('/gamification')
  findUserLevelAndExperience(
    @ActiveUserId() userId: string,
  ): Promise<GamificationInfo> {
    return this.usersService.findUserLevelAndExperience(userId);
  }
}
