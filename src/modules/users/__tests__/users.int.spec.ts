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
  let createdUser: User;

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
      await prismaService.user.deleteMany();

      createdUser = await usersRepository.create({
        id: crypto.randomUUID(),
        name: 'John Doe',
        email: 'johndoe@email.com',
        avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
        externalAccountId: 123456789,
      });

      const payload = { sub: createdUser.id };
      accessToken = await jwtService.signAsync(payload);
    });

    it('shoud be able to get the authenticated user', async () => {
      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toMatchObject({
        id: createdUser.id,
        avatarURL: createdUser.avatarURL,
      });
    });

    it('should be able to throw UnauthorizedException when token is missing', async () => {
      const response = await request(server)
        .get('/users')
        .set('Authorization', 'Bearer');

      expect(response.statusCode).toEqual(401);
      expect(JSON.parse(response.text)).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should be able to throw UnauthorizedException when is invalid token', async () => {
      const response = await request(server)
        .get('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        );

      expect(response.statusCode).toEqual(401);
      expect(JSON.parse(response.text)).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('shoud ble able to throw NotFound when user not exists', async () => {
      const payload = { sub: crypto.randomUUID() };
      const accessTokenWithInvalidUserId = await jwtService.signAsync(payload);

      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${accessTokenWithInvalidUserId}`);

      expect(response.statusCode).toEqual(404);
      expect(JSON.parse(response.text)).toEqual({
        message: 'User not found.',
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });
});
