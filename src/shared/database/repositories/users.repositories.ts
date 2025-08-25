import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
