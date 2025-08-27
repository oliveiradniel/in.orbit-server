import { Injectable } from '@nestjs/common';

import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findUserById(userId: string) {
    return this.usersRepository.getUserById(userId);
  }
}
