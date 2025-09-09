import { type GitHubUser } from '../entities/github-user.entity';
import { type AccessTokenResponse } from 'src/shared/interfaces/access-token.interface';

export abstract class GitHubIntegration {
  abstract getAccessTokenFromCode(code: string): Promise<AccessTokenResponse>;

  abstract getUserFromGitHubAccessToken(
    accessToken: string,
  ): Promise<GitHubUser>;
}
