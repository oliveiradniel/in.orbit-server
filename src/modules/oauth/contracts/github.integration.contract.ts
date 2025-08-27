import { GitHubUser } from '../entities/github-user.entity';

export abstract class GitHubIntegration {
  abstract getAccessTokenFromCode(
    code: string,
  ): Promise<{ accessToken: string }>;

  abstract getUserFromGitHubAccessToken(
    accessToken: string,
  ): Promise<GitHubUser>;
}
