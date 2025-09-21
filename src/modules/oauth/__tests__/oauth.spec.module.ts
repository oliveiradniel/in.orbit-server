import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { OAuthController } from '../oauth.controller';

import { OAuthService } from '../oauth.service';
import { PrismaService } from 'src/shared/database/prisma.service';

import { PrismaUsersRepository } from 'src/shared/database/repositories/users.repository';

import { OAuthMockFactory } from '../__factories__/oauth-mock.factory';

import { getConfig } from 'src/shared/config/config.helper';

import {
  CONFIG_SERVICE,
  GITHUB_INTEGRATION,
  JWT_SERVICE,
  OAUTH_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

@Module({
  controllers: [OAuthController],
  providers: [
    { provide: CONFIG_SERVICE, useClass: ConfigService },
    { provide: OAUTH_SERVICE, useClass: OAuthService },
    {
      provide: GITHUB_INTEGRATION,
      useValue: OAuthMockFactory.github.integration,
    },
    { provide: USERS_REPOSITORY, useClass: PrismaUsersRepository },
    { provide: PRISMA_SERVICE, useClass: PrismaService },
    {
      provide: JWT_SERVICE,
      useFactory: (config: ConfigService) => {
        const { JWT_SECRET } = getConfig(config);

        return new JwtService({ privateKey: JWT_SECRET });
      },
      inject: [CONFIG_SERVICE],
    },
  ],
})
export class OAuthSpecModule {}
