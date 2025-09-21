import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OAuthService } from '../oauth.service';

import { OAuthMockFactory } from '../__factories__/oauth-mock.factory';
import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { JWTMockFactory } from 'src/shared/__factories__/jwt-mock.factory';

import {
  GITHUB_INTEGRATION,
  JWT_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

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

    oauthService = module.get<OAuthService>(OAuthService);
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
      let mockGitHubUser: ReturnType<
        typeof OAuthMockFactory.github.create.user
      >;
      let mockGitHubAccessToken: ReturnType<
        typeof OAuthMockFactory.github.create.accessToken
      >;

      beforeEach(() => {
        mockGitHubUser = OAuthMockFactory.github.create.user();
        mockGitHubAccessToken = OAuthMockFactory.github.create.accessToken();

        OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.success(
          mockGitHubAccessToken,
        );
        OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.success(
          mockGitHubUser,
          mockGitHubAccessToken,
        );

        JWTMockFactory.responses.service.signAsync.success(
          mockGitHubAccessToken,
        );
      });

      describe('when the user already exists', () => {
        it('should return an access token without creating a new user', async () => {
          const mockUserId = UsersMockFactory.create.id();

          UsersMockFactory.responses.repository.getUserByExternalAccountId.success(
            { id: mockUserId },
          );

          const response = await oauthService.githubLogin(mockCode);

          expect(
            OAuthMockFactory.github.integration.getAccessTokenFromCode,
          ).toHaveBeenCalledWith(mockCode);
          expect(
            OAuthMockFactory.github.integration.getUserFromGitHubAccessToken,
          ).toHaveBeenCalledWith(mockGitHubAccessToken);

          expect(
            UsersMockFactory.repository.getUserByExternalAccountId,
          ).toHaveBeenCalledWith(mockGitHubUser.id);
          expect(UsersMockFactory.repository.create).not.toHaveBeenCalled();

          expect(JWTMockFactory.service.signAsync).toHaveBeenCalledWith(
            expect.objectContaining({ sub: mockUserId }),
          );

          expect(response).toEqual({
            accessToken: mockGitHubAccessToken,
          });
        });
      });

      describe('when the user does not exist', () => {
        it('should create user and return access token when user does not exist', async () => {
          const mockUserId = UsersMockFactory.create.id();

          const mockUser = {
            id: mockUserId,
            name: mockGitHubUser.name,
            email: mockGitHubUser.email,
            avatarURL: mockGitHubUser.avatarURL,
            externalAccountId: mockGitHubUser.id,
          };

          UsersMockFactory.responses.repository.getUserByExternalAccountId.null();
          UsersMockFactory.responses.repository.create.success(mockUser);

          const response = await oauthService.githubLogin(mockCode);

          expect(
            OAuthMockFactory.github.integration.getAccessTokenFromCode,
          ).toHaveBeenCalledWith(mockCode);
          expect(
            OAuthMockFactory.github.integration.getUserFromGitHubAccessToken,
          ).toHaveBeenCalledWith(mockGitHubAccessToken);

          expect(
            UsersMockFactory.repository.getUserByExternalAccountId,
          ).toHaveBeenCalledWith(mockGitHubUser.id);
          expect(UsersMockFactory.repository.create).toHaveBeenCalledWith(
            expect.objectContaining({
              name: mockGitHubUser.name,
              email: mockGitHubUser.email,
              avatarURL: mockGitHubUser.avatarURL,
              externalAccountId: mockGitHubUser.id,
            }),
          );

          expect(JWTMockFactory.service.signAsync).toHaveBeenCalledWith(
            expect.objectContaining({ sub: mockUserId }),
          );

          expect(response).toEqual({
            accessToken: mockGitHubAccessToken,
          });
        });
      });
    });

    describe('error', () => {
      it('should throw BadRequest error when github ID not found', async () => {
        OAuthMockFactory.github.responses.integration.getUserFromGitHubAccessToken.failure();

        const result = oauthService.githubLogin(mockCode);

        await expect(result).rejects.toThrow(BadRequestException);
        await expect(result).rejects.toThrow('GitHub user ID not found.');
      });

      it('should throw BadRequest error when request fails', async () => {
        OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.failure();

        const result = oauthService.githubLogin(mockCode);

        await expect(result).rejects.toThrow(BadRequestException);
        await expect(result).rejects.toThrow('GitHub auth failed: Error.');
      });

      it('should throw BadRequest error when code or token is missing', async () => {
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
