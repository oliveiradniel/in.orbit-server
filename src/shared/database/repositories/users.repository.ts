import { Inject, Injectable } from '@nestjs/common';

import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { PRISMA_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
  ) {}

  getUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarURL: true,
      },
    });
  }

  getUserByExternalAccountId(githubUserId: number) {
    return this.prismaService.user.findUnique({
      where: {
        externalAccountId: githubUserId,
      },
    });
  }

  create(createUserDTO: Prisma.UserCreateInput) {
    const { name, email, avatarURL, externalAccountId } = createUserDTO;

    return this.prismaService.user.create({
      data: {
        name,
        email,
        avatarURL,
        externalAccountId,
      },
    });
  }
}
