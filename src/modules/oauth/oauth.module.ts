import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OAuthService } from './oauth.service';

import { OAuthController } from './oauth.controller';

import { getConfig } from 'src/shared/config/config.helper';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const getConfigService = getConfig(configService);

        return {
          secret: getConfigService.JWT_SECRET,
          signOptions: { expiresIn: '2d' },
        };
      },
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule {}
