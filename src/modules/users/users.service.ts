import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserById(userId: string) {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
