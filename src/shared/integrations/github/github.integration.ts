import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { AccessTokenResponse } from './interfaces/access-token-response.interface';
import { UserResponse } from './interfaces/user-response.interface';

@Injectable()
export class GitHubIntegration {
  constructor(private readonly configService: ConfigService) {}

  async getAccessTokenFromCode(code: string) {
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
      throw new Error(`GitHub auth failed: ${response.statusText}`);
    }

    const { access_token } = (await response.json()) as AccessTokenResponse;

    if (!access_token) {
      throw new BadRequestException(
        'Invalid GitHub code or token not received',
      );
    }

    return access_token;
  }

  async getUserFromGitHubAccessToken(accessToken: string) {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = (await response.json()) as UserResponse;

    return data;
  }
}
