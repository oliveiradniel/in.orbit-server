import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { UsersSpecModule } from './users.spec.module';

import { PrismaService } from 'src/shared/database/prisma.service';

import { createTestUser } from 'src/shared/__tests__/helpers/create-test-user.helper';
import { describeAuthGuard } from 'src/shared/__tests__/helpers/describe-auth-guard.helper';
import { describeUserNotExists } from 'src/shared/__tests__/helpers/describe-user-not-exists.helper';

import { JWT_SERVICE, PRISMA_SERVICE } from 'src/shared/constants/tokens';

describe('Users Module', () => {
  let app: INestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UsersSpecModule],
    }).compile();

    app = module.createNestApplication<INestApplication>();
    await app.init();

    server = app.getHttpServer() as Server;

    prismaService = module.get<PrismaService>(PRISMA_SERVICE);
    jwtService = module.get<JwtService>(JWT_SERVICE);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET/ users', () => {
    describe('Authenticated requests', () => {
      it('shoud to get the authenticated user', async () => {
        const { user, accessToken } = await createTestUser({
          prismaService,
          jwtService,
        });

        const response = await request(server)
          .get('/users')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({
          id: user.id,
          avatarURL: user.avatarURL,
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
