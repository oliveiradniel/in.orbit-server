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
import {
  expectUnauthorized,
  expectUserNotFound,
} from 'src/shared/__tests__/helpers/expect-errors.helper';

import {
  JWT_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

describe('Users Integration', () => {
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
    beforeEach(async () => {
      const result = await createTestUser({
        usersRepository,
        prismaService,
        jwtService,
      });

      activerUser = result.user;
      accessToken = result.accessToken;
    });

    it('shoud be able to get the authenticated user', async () => {
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

    it('should be able to throw UnauthorizedException when token is missing', async () => {
      const response = await request(server)
        .get('/users')
        .set('Authorization', 'Bearer');

      expectUnauthorized(response);
    });

    it('should be able to throw UnauthorizedException when is invalid token', async () => {
      const response = await request(server)
        .get('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        );

      expectUnauthorized(response);
    });

    it('shoud ble able to throw NotFound when user not exists', async () => {
      const payload = { sub: crypto.randomUUID() };
      const accessTokenWithInvalidUserId = await jwtService.signAsync(payload);

      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${accessTokenWithInvalidUserId}`);

      expectUserNotFound(response);
    });
  });
});
