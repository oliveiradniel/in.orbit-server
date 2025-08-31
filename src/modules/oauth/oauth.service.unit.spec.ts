import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OAuthService } from './oauth.service';
import { OAuthMockFactory } from './__factories__/oauth-mock.factory';

import { GITHUB_INTEGRATION } from './contracts/github.integration.contract';

import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { USERS_REPOSITORY } from 'src/shared/contracts/users-repository.contract';

import {
  JWT_SERVICE,
  JWTMockFactory,
} from 'src/shared/__factories__/jwt-mock.factory';

describe('OAuthService', () => {
  let oauthService: OAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OAuthService,
        {
          provide: GITHUB_INTEGRATION,
          useValue: OAuthMockFactory.github.integration,
        },
        {
          provide: USERS_REPOSITORY,
          useValue: UsersMockFactory.repository,
        },
        {
          provide: JWT_SERVICE,
          useValue: JWTMockFactory.service,
        },
      ],
    }).compile();

    oauthService = module.get(OAuthService);
  });

  describe('githubLogin', () => {
    let mockCode: ReturnType<typeof OAuthMockFactory.github.create.code>;

    beforeEach(() => {
      mockCode = OAuthMockFactory.github.create.code();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe('success', () => {
      let mockGitHubUserId: ReturnType<
        typeof OAuthMockFactory.github.create.id
      >;
      let mockGitHubUser: ReturnType<
        typeof OAuthMockFactory.github.create.user
      >;
      let mockGitHubAccessToken: ReturnType<
        typeof OAuthMockFactory.github.create.accessToken
      >;

      beforeEach(() => {
        OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.success();
        OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.success();

        JWTMockFactory.responses.service.signAsync.success();

        mockGitHubUserId = OAuthMockFactory.github.create.id();
        mockGitHubUser = OAuthMockFactory.github.create.user();
        mockGitHubAccessToken = OAuthMockFactory.github.create.accessToken();
      });

      describe('when the user already exists', () => {
        beforeEach(() => {
          UsersMockFactory.responses.repository.getUserByExternalAccountId.success();
        });

        it('should return an access token without creating a new user', async () => {
          const result = await oauthService.githubLogin(mockCode);

          expect(
            OAuthMockFactory.github.integration.getAccessTokenFromCode,
          ).toHaveBeenCalledWith(mockCode);
          expect(
            OAuthMockFactory.github.integration.getUserFromGitHubAccessToken,
          ).toHaveBeenCalledWith(mockGitHubAccessToken);

          expect(
            UsersMockFactory.repository.getUserByExternalAccountId,
          ).toHaveBeenCalledWith(mockGitHubUserId);
          expect(UsersMockFactory.repository.create).not.toHaveBeenCalled();

          expect(JWTMockFactory.service.signAsync).toHaveBeenCalledWith(
            expect.objectContaining({ sub: UsersMockFactory.create.id() }),
          );

          expect(result).toEqual({
            accessToken: JWTMockFactory.create.accessToken(),
          });
        });
      });

      describe('when the user does not exist', () => {
        beforeEach(() => {
          UsersMockFactory.responses.repository.getUserByExternalAccountId.null();
          UsersMockFactory.responses.repository.create.success();
        });

        it('should create user and return access token when user does not exist', async () => {
          const result = await oauthService.githubLogin(mockCode);

          expect(
            OAuthMockFactory.github.integration.getAccessTokenFromCode,
          ).toHaveBeenCalledWith(mockCode);
          expect(
            OAuthMockFactory.github.integration.getUserFromGitHubAccessToken,
          ).toHaveBeenCalledWith(mockGitHubAccessToken);

          expect(
            UsersMockFactory.repository.getUserByExternalAccountId,
          ).toHaveBeenCalledWith(mockGitHubUserId);
          expect(UsersMockFactory.repository.create).toHaveBeenCalledWith(
            expect.objectContaining({
              name: mockGitHubUser.name,
              email: mockGitHubUser.email,
              avatarURL: mockGitHubUser.avatarURL,
              externalAccountId: mockGitHubUser.id,
            }),
          );

          expect(JWTMockFactory.service.signAsync).toHaveBeenCalledWith(
            expect.objectContaining({ sub: UsersMockFactory.create.id() }),
          );

          expect(result).toEqual({
            accessToken: JWTMockFactory.create.accessToken(),
          });
        });
      });
    });

    describe('error', () => {
      it('should throw Error when request fails', async () => {
        OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.failure();

        const result = oauthService.githubLogin(mockCode);

        await expect(result).rejects.toThrow(Error);
        await expect(result).rejects.toThrow('GitHub auth failed: Error.');
      });

      it('should throw BadRequestException when code or token is missing', async () => {
        OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.invalidData();

        const result = oauthService.githubLogin(mockCode);

        await expect(result).rejects.toThrow(BadRequestException);
        await expect(result).rejects.toThrow(
          'Invalid GitHub code or token not received.',
        );
      });
    });
  });
});
