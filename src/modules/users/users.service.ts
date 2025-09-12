import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { type UsersRepository } from 'src/shared/contracts/users-repository.contract';
import { type UserWithoutExternalAccountId } from 'src/shared/database/interfaces/user/user-without-external-account-id.interface';

import { USERS_REPOSITORY } from 'src/shared/constants/tokens';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async findUserById(userId: string): Promise<UserWithoutExternalAccountId> {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
