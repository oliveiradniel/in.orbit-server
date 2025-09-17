import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { type User, type Prisma } from '@prisma/client';
import { type UsersRepository } from 'src/shared/contracts/users-repository.contract';
import { type UserWithoutExternalAccountId } from '../interfaces/user/user-without-external-account-id.interface';
import { type UserIdentifier } from '../interfaces/user/user-identifier.interface';
import { type UserExperience } from '../interfaces/user/user-experience.interface';

import { PRISMA_SERVICE } from 'src/shared/constants/tokens';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
  ) {}

  getUserById(userId: string): Promise<UserWithoutExternalAccountId> {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarURL: true,
        experiencePoints: true,
      },
    });
  }

  getUserByExternalAccountId(githubUserId: number): Promise<UserIdentifier> {
    return this.prismaService.user.findUnique({
      where: {
        externalAccountId: githubUserId,
      },
      select: {
        id: true,
      },
    });
  }

  async getUserExperience(userId: string): Promise<UserExperience | null> {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        experiencePoints: true,
      },
    });
  }

  create({
    name,
    email,
    avatarURL,
    externalAccountId,
  }: Prisma.UserCreateInput): Promise<User> {
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
