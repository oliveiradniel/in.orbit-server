import { GitHubUser } from '../entities/github-user.entity';

export const GITHUB_INTEGRATION = Symbol('GITHUB_INTEGRATION');

export abstract class GitHubIntegration {
  abstract getAccessTokenFromCode(
    code: string,
  ): Promise<{ accessToken: string }>;

  abstract getUserFromGitHubAccessToken(
    accessToken: string,
  ): Promise<GitHubUser>;
}
