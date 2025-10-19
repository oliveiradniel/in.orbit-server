import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { OAuthService } from './oauth.service';

import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { getConfig } from 'src/shared/config/config.helper';

import { AuthenticateGitHubDTO } from './dtos/authenticate-github.dto';

import { UnauthorizedResponseDOCS } from 'src/shared/responses/docs/unauthorized-response.docs';
import { BadRequestOAuthResponseDOCS } from './responses/docs/bad-request-oauth-response.docs';

import { type GitHubAuthenticateResponse } from './interfaces/github-authenticate-response.interface';
import { type LogoutResponse } from './interfaces/logout-response.interface';

import { CONFIG_SERVICE, OAUTH_SERVICE } from 'src/shared/constants/tokens';

@Controller('oauth')
export class OAuthController {
  constructor(
    @Inject(OAUTH_SERVICE) private readonly oauthService: OAuthService,
    @Inject(CONFIG_SERVICE) private readonly configService: ConfigService,
  ) {}

  @ApiOkResponse({
    description: 'Successful authentication with GitHub code.',
    schema: {
      example: { message: 'Login successful.' },
    },
    // type: GitHubAuthenticateResponseDOCS,
  })
  @ApiBadRequestResponse({
    description: 'Invalid GitHub code or missing token.',
    type: BadRequestOAuthResponseDOCS,
  })
  @IsPublic()
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
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    return { message: 'Login successful.' };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized request.',
    type: UnauthorizedResponseDOCS,
  })
  @ApiOkResponse({
    description: 'User successfully logged out.',
    schema: {
      example: { message: 'Logged out successfully.' },
    },
  })
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): LogoutResponse {
    const { NODE_ENV } = getConfig(this.configService);

    response.cookie('token', '', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      expires: new Date(0),
    });

    return { message: 'Logged out successfully.' };
  }
}
