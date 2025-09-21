import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

import { AmbientMode } from './config.interface';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  FRONTEND_ORIGIN: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DB: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  GITHUB_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GITHUB_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  NODE_ENV: AmbientMode;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
