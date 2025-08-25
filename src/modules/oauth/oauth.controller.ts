import { Body, Controller, Post } from '@nestjs/common';

import { OAuthService } from './oauth.service';

import { AuthenticateGitHubDTO } from './dtos/authenticate-github.dto';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post('github')
  githubAuthenticate(@Body() authenticateGitHubDTO: AuthenticateGitHubDTO) {
    const { code } = authenticateGitHubDTO;

    return this.oauthService.githubLogin(code);
  }
}
