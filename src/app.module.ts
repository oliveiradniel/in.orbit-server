import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { GoalsModule } from './modules/goals/goals.module';
import { GoalsCompletedModule } from './modules/goals-completed/goals-completed.module';
import { AuthModule } from './modules/auth/auth.module';
import { OAuthModule } from './modules/oauth/oauth.module';
import { DatabaseModule } from './shared/database/database.module';
import { IntegrationModule } from './shared/integrations/integration.module';

import { AuthGuard } from './modules/auth/auth.guard';

import { validate } from './shared/config/configuration';
import { UsersModule } from './modules/users/users.module';

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
    UsersModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
