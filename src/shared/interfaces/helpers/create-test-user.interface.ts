import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

export interface CreateTestUserParams {
  usersRepository: UsersRepository;
  jwtService: JwtService;
  override?: Partial<User>;
}
