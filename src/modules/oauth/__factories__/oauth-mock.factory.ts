import { BadRequestException } from '@nestjs/common';

import { vi } from 'vitest';

import { GitHubUser } from '../entities/github-user.entity';

export class OAuthMockFactory {
  static github = {
    integration: {
      getAccessTokenFromCode: vi.fn(),
      getUserFromGitHubAccessToken: vi.fn(),
    },

    create: {
      id: (id = 123456789): number => id,

      code: (code = '987654321'): string => code,

      user: (override?: Partial<GitHubUser>): GitHubUser => ({
        id: this.github.create.id(),
        name: 'John Doe',
        email: 'johndoe@email.com',
        avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
        ...override,
      }),

      accessToken: (accessToken = 'github-access-token'): string => accessToken,
    },

    responses: {
      integration: {
        getAccessTokenFromCode: {
          success: () =>
            this.github.integration.getAccessTokenFromCode.mockResolvedValue({
              accessToken: this.github.create.accessToken(),
            }),
          failure: () =>
            this.github.integration.getAccessTokenFromCode.mockRejectedValue(
              new BadRequestException('GitHub auth failed: Error.'),
            ),
          invalidData: () =>
            this.github.integration.getAccessTokenFromCode.mockRejectedValue(
              new BadRequestException(
                'Invalid GitHub code or token not received.',
              ),
            ),
        },
        getUserFromGitHubAccessToken: {
          success: () => {
            this.github.responses.integration.getAccessTokenFromCode.success();
            this.github.integration.getUserFromGitHubAccessToken.mockResolvedValue(
              this.github.create.user(),
            );
          },
        },
      },
    },
  };
}
