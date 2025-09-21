import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { type UsersRepository } from 'src/shared/contracts/users-repository.contract';
import { type GitHubIntegration } from './contracts/github.integration.contract';
import { type AccessTokenResponse } from 'src/shared/interfaces/access-token.interface';

import {
  GITHUB_INTEGRATION,
  JWT_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(GITHUB_INTEGRATION)
    private readonly githubIntegration: GitHubIntegration,
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
    @Inject(JWT_SERVICE) private readonly jwtService: JwtService,
  ) {}

  async githubLogin(code: string): Promise<AccessTokenResponse> {
    const { accessToken: githubAccessToken } =
      await this.githubIntegration.getAccessTokenFromCode(code);

    const githubUser =
      await this.githubIntegration.getUserFromGitHubAccessToken(
        githubAccessToken,
      );

    if (!githubUser?.id) {
      throw new BadRequestException('GitHub user ID not found');
    }

    const user = await this.usersRepository.getUserByExternalAccountId(
      githubUser.id,
    );

    let userId: string | undefined;

    if (user) {
      userId = user.id;
    } else {
      const createdUser = await this.usersRepository.create({
        name: githubUser.name,
        email: githubUser.email,
        avatarURL: githubUser.avatarURL,
        externalAccountId: githubUser.id,
      });

      userId = createdUser.id;
    }

    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
