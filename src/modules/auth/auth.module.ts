import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getConfig } from 'src/shared/config/config.helper';
import { JWT_SERVICE } from 'src/shared/constants/tokens';

@Global()
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
  providers: [{ provide: JWT_SERVICE, useExisting: JwtService }],
  exports: [JwtModule, JWT_SERVICE],
})
export class AuthModule {}
