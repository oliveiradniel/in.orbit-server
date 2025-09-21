import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { OAuthService } from './oauth.service';

import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { getConfig } from 'src/shared/config/config.helper';

import { AuthenticateGitHubDTO } from './dtos/authenticate-github.dto';

import { type GitHubAuthenticateResponse } from './interfaces/github-authenticate-response.interface';

import { OAUTH_SERVICE } from 'src/shared/constants/tokens';

@IsPublic()
@Controller('oauth')
export class OAuthController {
  constructor(
    @Inject(OAUTH_SERVICE) private readonly oauthService: OAuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Authenticate user from GitHub code',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'JWT code.',
        },
      },
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZTkzYmI0Ni05MGVjLTRhNjEtYTM3Zi1lMTEyOTA4OTMzZTciLCJpYXQiOjE3NTYxMjU3ODYsImV4cCI6MTc1NjI5ODU4Nn0.cPKtrNqY7-nEaCeWisupna9aF3MaC0E3Egmt6cOIhYo',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid GitHub code or token not received',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid GitHub code or token not received',
        },
        error: { type: 'string', example: 'Bad request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @Post('github')
  async githubAuthenticate(
    @Body() authenticateGitHubDTO: AuthenticateGitHubDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GitHubAuthenticateResponse> {
    const { code } = authenticateGitHubDTO;

    const { accessToken } = await this.oauthService.githubLogin(code);

    const { NODE_ENV } = getConfig(this.configService);

    response.cookie('token', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'prod',
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    return { message: 'Login successful' };
  }
}
