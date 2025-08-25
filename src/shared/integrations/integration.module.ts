import { Global, Module } from '@nestjs/common';

import { GitHubIntegration } from './github/github.integration';

@Global()
@Module({
  providers: [GitHubIntegration],
  exports: [GitHubIntegration],
})
export class IntegrationModule {}
