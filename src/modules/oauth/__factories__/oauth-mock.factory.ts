import { BadRequestException } from '@nestjs/common';

import { vi } from 'vitest';

import { GitHubUser } from '../entities/github-user.entity';

import { FakerFactory } from 'src/shared/__factories__/faker.factory';

export class OAuthMockFactory {
  static github = {
    integration: {
      getAccessTokenFromCode: vi.fn(),
      getUserFromGitHubAccessToken: vi.fn(),
    },

    create: {
      id: (id = FakerFactory.github.id()): number => id,

      code: (code = FakerFactory.github.code()): string => code,

      user: (override: Partial<GitHubUser> = {}): GitHubUser => ({
        id: OAuthMockFactory.github.create.id(),
        name: FakerFactory.github.name(),
        email: FakerFactory.github.email(),
        avatarURL: FakerFactory.github.avatarURL(),
        ...override,
      }),

      accessToken: (accessToken = FakerFactory.data.token()): string =>
        accessToken,

      avatarURL: () => FakerFactory.github.avatarURL(),
    },

    responses: {
      integration: {
        getAccessTokenFromCode: {
          success: (accessToken?: string) =>
            OAuthMockFactory.github.integration.getAccessTokenFromCode.mockResolvedValue(
              {
                accessToken:
                  OAuthMockFactory.github.create.accessToken(accessToken),
              },
            ),
          failure: () =>
            OAuthMockFactory.github.integration.getAccessTokenFromCode.mockRejectedValue(
              new BadRequestException('GitHub auth failed: Error.'),
            ),
          invalidData: () =>
            OAuthMockFactory.github.integration.getAccessTokenFromCode.mockRejectedValue(
              new BadRequestException(
                'Invalid GitHub code or token not received.',
              ),
            ),
        },
        getUserFromGitHubAccessToken: {
          success: (
            override: Partial<GitHubUser> = {},
            accessToken?: string,
          ) => {
            OAuthMockFactory.github.responses.integration.getAccessTokenFromCode.success(
              accessToken,
            );
            OAuthMockFactory.github.integration.getUserFromGitHubAccessToken.mockResolvedValue(
              OAuthMockFactory.github.create.user(override),
            );
          },
        },
      },
    },
  };
}
