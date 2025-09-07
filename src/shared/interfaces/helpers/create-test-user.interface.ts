import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';

import { PrismaService } from 'src/shared/database/prisma.service';

export interface CreateTestUserParams {
  prismaService: PrismaService;
  jwtService: JwtService;
  override?: Partial<User>;
}
