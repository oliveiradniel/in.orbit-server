import { Module } from '@nestjs/common';

import { OAuthService } from './oauth.service';

import { OAuthController } from './oauth.controller';
import { OAUTH_SERVICE } from 'src/shared/constants/tokens';

@Module({
  imports: [],
  controllers: [OAuthController],
  providers: [{ provide: OAUTH_SERVICE, useClass: OAuthService }],
})
export class OAuthModule {}
