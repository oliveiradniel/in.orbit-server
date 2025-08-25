import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GoalsModule } from './modules/goals/goals.module';
import { GoalsCompletedModule } from './modules/goals-completed/goals-completed.module';
import { AuthModule } from './modules/auth/auth.module';
import { OAuthModule } from './modules/oauth/oauth.module';
import { DatabaseModule } from './shared/database/database.module';
import { IntegrationModule } from './shared/integrations/integration.module';

import { validate } from './shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    GoalsModule,
    GoalsCompletedModule,
    AuthModule,
    OAuthModule,
    DatabaseModule,
    IntegrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
