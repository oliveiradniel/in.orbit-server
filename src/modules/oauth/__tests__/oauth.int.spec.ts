import { Test } from '@nestjs/testing';
import { type NestApplication } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { OAuthSpecModule } from './oauth.spec.module';
import { OAuthMockFactory } from '../__factories__/oauth-mock.factory';

import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

import { PrismaService } from 'src/shared/database/prisma.service';

import { getConfig } from 'src/shared/config/config.helper';

import {
  JWT_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

describe('OAuth Module', () => {
  let app: NestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [OAuthSpecModule],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    server = app.getHttpServer() as Server;

    prismaService = module.get(PRISMA_SERVICE);
    jwtService = module.get(JWT_SERVICE);
    configService = module.get(ConfigService);

    usersRepository = module.get(USERS_REPOSITORY);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST', () => {
    describe('/oauth', () => {
      describe('/github', () => {
        describe('should to authenticate by code', () => {
          const mockCode = OAuthMockFactory.github.create.code();
          const mockGitHubAccessToken =
            OAuthMockFactory.github.create.accessToken();

          it('when not user exists', async () => {
            OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.success();
            OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.success();

            const response = await request(server)
              .post('/oauth/github')
              .send({ code: mockCode });

            const data = response.body as { accessToken: string };

            const payload = await jwtService.verifyAsync<{ sub: string }>(
              data.accessToken,
              {
                secret: getConfig(configService).JWT_SECRET,
              },
            );

            const user = await usersRepository.getUserById(payload.sub);

            expect(
              OAuthMockFactory.github.integration.getAccessTokenFromCode,
            ).toHaveBeenCalledWith(mockCode);
            expect(
              OAuthMockFactory.github.integration.getUserFromGitHubAccessToken,
            ).toHaveBeenCalledWith(mockGitHubAccessToken);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('accessToken');
            expect(user).toMatchObject({
              id: payload.sub,
            });
          });

          it('when user exists', async () => {
            const userId = crypto.randomUUID();

            await prismaService.user.create({
              data: {
                id: userId,
                avatarURL:
                  'https://avatars.githubusercontent.com/u/189175871?v=4',
                externalAccountId: OAuthMockFactory.github.create.id(),
              },
            });

            OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.success();
            OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.success();

            const response = await request(server)
              .post('/oauth/github')
              .send({ code: mockCode });

            const data = response.body as { accessToken: string };

            const payload = await jwtService.verifyAsync<{ sub: string }>(
              data.accessToken,
              {
                secret: getConfig(configService).JWT_SECRET,
              },
            );

            const user = await usersRepository.getUserById(payload.sub);

            expect(
              OAuthMockFactory.github.integration.getAccessTokenFromCode,
            ).toHaveBeenCalledWith(mockCode);
            expect(
              OAuthMockFactory.github.integration.getUserFromGitHubAccessToken,
            ).toHaveBeenCalledWith(mockGitHubAccessToken);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('accessToken');
            expect(user).toMatchObject({
              id: payload.sub,
            });
          });
        });
      });
    });
  });
});
