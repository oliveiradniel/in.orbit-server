import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type GitHubIntegration } from 'src/modules/oauth/contracts/github.integration.contract';
import { type GitHubUser } from 'src/modules/oauth/entities/github-user.entity';
import { type GitHubUserResponse } from './interfaces/user-response.interface';
import { type GitHubAccessTokenResponse } from './interfaces/github-access-token-response.interface';
import { type AccessTokenResponse } from 'src/shared/interfaces/access-token.interface';

@Injectable()
export class HTTPGitHubIntegration implements GitHubIntegration {
  constructor(private readonly configService: ConfigService) {}

  async getAccessTokenFromCode(code: string): Promise<AccessTokenResponse> {
    const accessTokenURL = new URL(
      'https://github.com/login/oauth/access_token',
    );

    accessTokenURL.searchParams.set(
      'client_id',
      this.configService.get('GITHUB_CLIENT_ID')!,
    );

    accessTokenURL.searchParams.set(
      'client_secret',
      this.configService.get('GITHUB_CLIENT_SECRET')!,
    );

    accessTokenURL.searchParams.set('code', code);

    const response = await fetch(accessTokenURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new BadRequestException(
        `GitHub auth failed: ${response.statusText}.`,
      );
    }

    const { access_token } =
      (await response.json()) as GitHubAccessTokenResponse;

    if (!access_token) {
      throw new BadRequestException(
        'Invalid GitHub code or token not received.',
      );
    }

    return { accessToken: access_token };
  }

  async getUserFromGitHubAccessToken(accessToken: string): Promise<GitHubUser> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = (await response.json()) as GitHubUserResponse;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarURL: data.avatar_url,
    };
  }
}
