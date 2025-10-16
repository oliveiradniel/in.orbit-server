export type AmbientMode = 'dev' | 'prod' | 'test';

export interface AppConfig {
  PORT: number;
  HOST: string;
  FRONTEND_ORIGIN: string;
  POSTGRES_PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  DATABASE_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  JWT_SECRET: string;
  NODE_ENV: AmbientMode;
}
