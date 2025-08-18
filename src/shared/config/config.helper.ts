import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config.interface';

export function getConfig(configService: ConfigService): AppConfig {
  return {
    FRONTEND_ORIGIN: configService.get<string>('FRONTEND_ORIGIN')!,
    POSTGRES_USER: configService.get<string>('POSTGRES_USER')!,
    POSTGRES_PASSWORD: configService.get<string>('POSTGRES_PASSWORD')!,
    POSTGRES_DB: configService.get<string>('POSTGRES_DB')!,
    DATABASE_URL: configService.get<string>('DATABASE_URL')!,
  };
}
