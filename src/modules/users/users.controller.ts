import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Request, Response } from 'express';

import { UsersService } from './users.service';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';
import { getConfig } from 'src/shared/config/config.helper';

import { FindUserByIdResponseDOCS } from './responses/docs/find-user-by-id-response.docs';
import { FindUserLevelAndExperienceResponseDOCS } from './responses/docs/find-user-level-and-experience-response.docs';

import { UnauthorizedResponseDOCS } from 'src/shared/responses/docs/unauthorized-response.docs';
import { NotFoundUserResponseDOCS } from 'src/shared/responses/docs/not-found-user-response.docs';

import { type UserWithoutExternalAccountId } from 'src/shared/database/interfaces/user/user-without-external-account-id.interface';
import { type GamificationInfo } from './interfaces/gamification-info.interface';

import { CONFIG_SERVICE, USERS_SERVICE } from 'src/shared/constants/tokens';

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
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
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

  @ApiNoContentResponse({
    description: 'User account deleted and authentication cookie cleared.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(
    @ActiveUserId() userId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.usersService.deleteActiveUser(userId);

    const { NODE_ENV } = getConfig(this.configService);

    response.cookie('token', '', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      expires: new Date(0),
    });
  }
}
