import { Controller, Get, Inject } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';

import { FindUserByIdResponseDTO } from './dtos/find-user-by-id-response.dto';
import { UnauthorizedResponseDTO } from 'src/shared/dtos/unauthorized-response.dto';

import { type UserWithoutExternalAccountId } from 'src/shared/database/interfaces/user/user-without-external-account-id.interface';

import { USERS_SERVICE } from 'src/shared/constants/tokens';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized request.',
  type: UnauthorizedResponseDTO,
})
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: UsersService,
  ) {}

  @ApiOkResponse({
    description: 'Returns the currently authenticated user.',
    type: FindUserByIdResponseDTO,
  })
  @Get()
  findUserById(
    @ActiveUserId() userId: string,
  ): Promise<UserWithoutExternalAccountId> {
    return this.usersService.findUserById(userId);
  }
}
