import { ConfigService } from '@nestjs/config';

import { type AmbientMode, type AppConfig } from './config.interface';

export function getConfig(configService: ConfigService): AppConfig {
  return {
    PORT: configService.get<number>('PORT')!,
    HOST: configService.get<string>('HOST')!,
    FRONTEND_ORIGIN: configService.get<string>('FRONTEND_ORIGIN')!,
    POSTGRES_USER: configService.get<string>('POSTGRES_USER')!,
    POSTGRES_PASSWORD: configService.get<string>('POSTGRES_PASSWORD')!,
    POSTGRES_DB: configService.get<string>('POSTGRES_DB')!,
    DATABASE_URL: configService.get<string>('DATABASE_URL')!,
    GITHUB_CLIENT_ID: configService.get<string>('GITHUB_CLIENT_ID')!,
    GITHUB_CLIENT_SECRET: configService.get<string>('GITHUB_CLIENT_SECRET')!,
    JWT_SECRET: configService.get<string>('JWT_SECRET')!,
    NODE_ENV: configService.get<AmbientMode>('NODE_ENV')!,
  };
}
