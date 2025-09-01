import { Global, Module } from '@nestjs/common';

import { HTTPGitHubIntegration } from './github/github.integration';

import { GITHUB_INTEGRATION } from '../constants/tokens';

@Global()
@Module({
  providers: [
    {
      provide: GITHUB_INTEGRATION,
      useClass: HTTPGitHubIntegration,
    },
  ],
  exports: [GITHUB_INTEGRATION],
})
export class IntegrationModule {}
