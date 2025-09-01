import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { USERS_SERVICE } from 'src/shared/constants/tokens';

import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [{ provide: USERS_SERVICE, useClass: UsersService }],
})
export class UsersModule {}
