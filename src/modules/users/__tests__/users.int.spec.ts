import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { User } from '../entities/user.entity';
import { UsersSpecModule } from './users.spec.module';

import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

import { PrismaService } from 'src/shared/database/prisma.service';

import { createTestUser } from 'src/shared/__tests__/helpers/create-test-user.helper';
import { describeAuthGuard } from 'src/shared/__tests__/helpers/describe-auth-guard.helper';
import { describeUserNotExists } from 'src/shared/__tests__/helpers/describe-user-not-exists.helper';

import {
  JWT_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

describe('Users Module', () => {
  let app: INestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;

  let usersRepository: UsersRepository;

  let activerUser: User;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UsersSpecModule],
    }).compile();

    app = module.createNestApplication<INestApplication>();
    await app.init();

    server = app.getHttpServer() as Server;

    usersRepository = module.get<UsersRepository>(USERS_REPOSITORY);
    prismaService = module.get<PrismaService>(PRISMA_SERVICE);
    jwtService = module.get<JwtService>(JWT_SERVICE);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET/ users', () => {
    describe('Authenticated requests', () => {
      beforeEach(async () => {
        const result = await createTestUser({
          usersRepository,
          prismaService,
          jwtService,
          override: {
            id: crypto.randomUUID(),
          },
        });

        activerUser = result.user;
        accessToken = result.accessToken;
      });

      it('shoud to get the authenticated user', async () => {
        const response = await request(server)
          .get('/users')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({
          id: activerUser.id,
          avatarURL: activerUser.avatarURL,
        });
      });
    });

    describeUserNotExists({
      getServer: () => server,
      getJWTService: () => jwtService,
      route: '/users',
    });

    describeAuthGuard({
      getServer: () => server,
      route: '/users',
    });
  });
});
