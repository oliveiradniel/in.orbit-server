import { Controller, Get } from '@nestjs/common';

import { UsersService } from './users.service';

import { ActiveUserId } from 'src/shared/decorators/active-user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findUserById(@ActiveUserId() userId: string) {
    return this.usersService.findUserById(userId);
  }
}
