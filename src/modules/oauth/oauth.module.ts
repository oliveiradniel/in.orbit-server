import { Module } from '@nestjs/common';

import { OAuthService } from './oauth.service';

import { OAuthController } from './oauth.controller';

@Module({
  imports: [],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule {}
