import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

import { PrismaService } from 'src/shared/database/prisma.service';

export interface CreateTestUserParams {
  usersRepository: UsersRepository;
  prismaService: PrismaService;
  jwtService: JwtService;
  override: Omit<Partial<User>, 'id'> & { id: string };
}
