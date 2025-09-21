import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OAuthService } from './oauth.service';

import { OAuthController } from './oauth.controller';

import { CONFIG_SERVICE, OAUTH_SERVICE } from 'src/shared/constants/tokens';

@Module({
  imports: [],
  controllers: [OAuthController],
  providers: [
    { provide: OAUTH_SERVICE, useClass: OAuthService },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { provide: CONFIG_SERVICE, useClass: ConfigService },
  ],
})
export class OAuthModule {}
