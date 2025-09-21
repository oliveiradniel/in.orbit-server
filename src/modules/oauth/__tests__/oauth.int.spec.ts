import { Test } from '@nestjs/testing';
import { type NestApplication } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { getConfig } from 'src/shared/config/config.helper';

import { OAuthSpecModule } from './oauth.spec.module';

import { OAuthMockFactory } from '../__factories__/oauth-mock.factory';
import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';

import { PrismaService } from 'src/shared/database/prisma.service';

import { type UsersRepository } from 'src/shared/contracts/users-repository.contract';

import {
  CONFIG_SERVICE,
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

    prismaService = module.get<PrismaService>(PRISMA_SERVICE);
    jwtService = module.get<JwtService>(JWT_SERVICE);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    configService = module.get<ConfigService>(CONFIG_SERVICE);

    usersRepository = module.get(USERS_REPOSITORY);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST', () => {
    describe('/oauth', () => {
      describe('/github', () => {
        let mockCode: ReturnType<typeof OAuthMockFactory.github.create.code>;
        let mockGitHubAccessToken: ReturnType<
          typeof OAuthMockFactory.github.create.accessToken
        >;

        beforeEach(() => {
          mockCode = OAuthMockFactory.github.create.code();
          mockGitHubAccessToken = OAuthMockFactory.github.create.accessToken();
        });

        describe('should to authenticate by code', () => {
          it('when not user exists', async () => {
            OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.success();
            OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.success(
              {},
              mockGitHubAccessToken,
            );

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
            const userId = UsersMockFactory.create.id();

            await prismaService.user.create({
              data: {
                id: userId,
                avatarURL: OAuthMockFactory.github.create.avatarURL(),
                externalAccountId: OAuthMockFactory.github.create.id(),
              },
            });

            OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.success();
            OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.success(
              {},
              mockGitHubAccessToken,
            );

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

        it('should to throw BadRequest error when github user ID not found', async () => {
          OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.failure();

          const response = await request(server)
            .post('/oauth/github')
            .send({ code: mockCode });

          expect(
            OAuthMockFactory.github.integration.getAccessTokenFromCode,
          ).toHaveBeenCalled();
          expect(
            OAuthMockFactory.github.integration.getUserFromGitHubAccessToken,
          ).toHaveBeenCalled();

          expect(response.statusCode).toBe(400);
          expect(response.body).toEqual({
            message: 'GitHub user ID not found.',
            error: 'Bad Request',
            statusCode: 400,
          });
        });

        it('should to throw BadRequest error when request failure', async () => {
          OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.failure();

          const response = await request(server)
            .post('/oauth/github')
            .send({ code: mockCode });

          expect(
            OAuthMockFactory.github.integration.getAccessTokenFromCode,
          ).toHaveBeenCalled();

          expect(response.statusCode).toBe(400);
          expect(response.body).toEqual({
            message: 'GitHub auth failed: Error.',
            error: 'Bad Request',
            statusCode: 400,
          });
        });

        it('should to throw BadRequest error when code or token is missing', async () => {
          OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.invalidData();

          const response = await request(server)
            .post('/oauth/github')
            .send({ code: mockCode });

          expect(
            OAuthMockFactory.github.integration.getAccessTokenFromCode,
          ).toHaveBeenCalled();

          expect(response.statusCode).toBe(400);
          expect(response.body).toEqual({
            message: 'Invalid GitHub code or token not received.',
            error: 'Bad Request',
            statusCode: 400,
          });
        });
      });
    });
  });
});
