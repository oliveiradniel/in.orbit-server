import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { OAuthService } from './oauth.service';

import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { getConfig } from 'src/shared/config/config.helper';

import { AuthenticateGitHubDTO } from './dtos/authenticate-github.dto';

import { BadRequestResponseDOCS } from './responses/docs/bad-request-response.docs';
import { GitHubAuthenticateResponseDOCS } from './responses/docs/github-authenticate-response.docs';

import { type GitHubAuthenticateResponse } from './interfaces/github-authenticate-response.interface';

import { CONFIG_SERVICE, OAUTH_SERVICE } from 'src/shared/constants/tokens';

@IsPublic()
@Controller('oauth')
export class OAuthController {
  constructor(
    @Inject(OAUTH_SERVICE) private readonly oauthService: OAuthService,
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
  ) {}

  @ApiOkResponse({
    description: 'Successful authentication with GitHub code.',
    type: GitHubAuthenticateResponseDOCS,
  })
  @ApiBadRequestResponse({
    description: 'Invalid GitHub code or missing token.',
    type: BadRequestResponseDOCS,
  })
  @Post('github')
  async githubAuthenticate(
    @Body() authenticateGitHubDTO: AuthenticateGitHubDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GitHubAuthenticateResponse> {
    const { code } = authenticateGitHubDTO;

    const { accessToken } = await this.oauthService.githubLogin(code);

    const { NODE_ENV } = getConfig(this.configService);

    if (NODE_ENV === 'test') {
      return { accessToken: accessToken };
    }

    response.cookie('token', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'prod',
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    return { message: 'Login successful' };
  }
}
