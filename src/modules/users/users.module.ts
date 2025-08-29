import { Module } from '@nestjs/common';
import { USERS_SERVICE, UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [{ provide: USERS_SERVICE, useClass: UsersService }],
})
export class UsersModule {}
