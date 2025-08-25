import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { OAuthService } from './oauth.service';

import { AuthenticateGitHubDTO } from './dtos/authenticate-github.dto';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

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
  githubAuthenticate(@Body() authenticateGitHubDTO: AuthenticateGitHubDTO) {
    const { code } = authenticateGitHubDTO;

    return this.oauthService.githubLogin(code);
  }
}
