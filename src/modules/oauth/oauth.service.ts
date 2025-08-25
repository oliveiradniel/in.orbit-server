import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GitHubIntegration } from 'src/shared/integrations/github/github.integration';

import { UsersRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class OAuthService {
  constructor(
    private readonly githubIntegration: GitHubIntegration,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async githubLogin(code: string) {
    const githubAccessToken =
      await this.githubIntegration.getAccessTokenFromCode(code);

    const githubUser =
      await this.githubIntegration.getUserFromGitHubAccessToken(
        githubAccessToken,
      );

    const user = await this.usersRepository.getUserByExternalAccountId(
      githubUser.id,
    );

    let userId: string | null;

    if (user) {
      userId = user.id;
    } else {
      const createdUser = await this.usersRepository.create({
        name: githubUser.name,
        email: githubUser.email,
        avatarURL: githubUser.avatar_url,
        externalAccountId: githubUser.id,
      });

      userId = createdUser.id;
    }

    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
