import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getConfig } from 'src/shared/config/config.helper';

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
  exports: [JwtModule],
})
export class AuthModule {}
