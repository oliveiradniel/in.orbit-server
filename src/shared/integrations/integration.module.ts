import { Global, Module } from '@nestjs/common';
import { GitHubIntegration } from 'src/modules/oauth/contracts/github.integration.contract';
import { HTTPGitHubIntegration } from './github/github.integration';

@Global()
@Module({
  providers: [
    {
      provide: GitHubIntegration,
      useClass: HTTPGitHubIntegration,
    },
  ],
  exports: [GitHubIntegration],
})
export class IntegrationModule {}
