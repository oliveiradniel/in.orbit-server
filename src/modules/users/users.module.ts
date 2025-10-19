import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from './users.service';

import { UsersController } from './users.controller';

import { CONFIG_SERVICE, USERS_SERVICE } from 'src/shared/constants/tokens';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: USERS_SERVICE, useClass: UsersService },
    { provide: CONFIG_SERVICE, useClass: ConfigService },
  ],
})
export class UsersModule {}
