import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  USERS_REPOSITORY,
  UsersRepository,
} from 'src/shared/contracts/users-repository.contract';

export const USERS_SERVICE = Symbol('USERS_SERVICE');

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async findUserById(userId: string) {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
